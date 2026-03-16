import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const containerStyle = { width: "100%", height: "400px", borderRadius: "12px" };
const libraries = ["places"];

const NgoClaim = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { donateFoodId, foodItem, donor, pickupLocation, donorLocation } =
    location.state || {};

  const user = JSON.parse(localStorage.getItem("user"));
  const destination = user?.address?.coordinates;

  const [routePath, setRoutePath] = useState([]);
  const [traveledPath, setTraveledPath] = useState([]);
  const [hasFitBounds, setHasFitBounds] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(pickupLocation);
  const [eta, setEta] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [dotScale, setDotScale] = useState(10);
  const [deliveryStarted, setDeliveryStarted] = useState(false);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const fetchRoute = useCallback(async () => {
    if (!pickupLocation || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const path = result.routes[0].overview_path;
          setRoutePath(path);

          const leg = result.routes[0].legs[0];
          setEta(leg.duration.value);
          setRemainingDistance(leg.distance.value / 1000);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }, [pickupLocation, destination]);

  useEffect(() => {
    if (isLoaded) fetchRoute();
  }, [isLoaded, fetchRoute]);

  useEffect(() => {
    if (!isLoaded || routePath.length === 0 || !mapRef.current || hasFitBounds)
      return;

    const map = mapRef.current;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickupLocation);
    bounds.extend(destination);

    map.fitBounds(bounds);
    setHasFitBounds(true);
  }, [isLoaded, routePath, hasFitBounds]);

  const startDelivery = () => {
    if (routePath.length === 0) return;

    setDeliveryStarted(true);
    socket.emit("startDelivery");

    let index = 0;
    const totalDistance =
      window.google.maps.geometry.spherical.computeLength(routePath) / 1000;
    const intervalTime =
      ((totalDistance * 1000) / (routePath.length * 10)) * 1000;

    const moveVehicle = setInterval(async () => {
      if (index < routePath.length) {
        const newLocation = routePath[index];
        setCurrentLocation(newLocation);
        setTraveledPath((prev) => [...prev, newLocation]);

        const traveledDistance = (index / routePath.length) * totalDistance;
        setRemainingDistance(Math.max(0, totalDistance - traveledDistance));

        setEta(Math.round((remainingDistance * 1000) / 10));

        index++;
      } else {
        clearInterval(moveVehicle);
        setDeliveryCompleted(true);
        setEta(0);

        try {
          const email = user?.email;
          if (email) {
            const response = await axios.post(
              "http://localhost:5000/api/auth/reward",
              { id: donor._id.toString() }
            );
            if (response.status === 200) {
              alert(
                "Donation was successfully received by NGO & reward is credited!"
              );
            } else {
              throw new Error("Failed to credit reward.");
            }
          }
        } catch (error) {
          console.error("Error in reward API:", error);
          alert("Failed to process the reward.");
        }

        setTimeout(() => navigate("/dashboard"), 2000);
      }
    }, intervalTime);
  };

  useEffect(() => {
    if (!deliveryStarted) return;

    const blinkInterval = setInterval(() => {
      setDotScale((prev) => (prev === 10 ? 8 : 10));
    }, 500);

    return () => clearInterval(blinkInterval);
  }, [deliveryStarted]);

  const onConfirmOrder = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!user || !user._id) {
        alert("User not found! Please log in.");
        return;
      }

      const requestData = {
        donateFoodId: donateFoodId,
        ngoId: user._id,
        items: [
          { foodItemId: foodItem._id, claimedQuantity: foodItem.totalQuantity },
        ],
      };
      console.log(requestData);

      const response = await axios.post(
        "http://localhost:5000/api/food/claim-food",
        requestData
      );

      if (response.status === 200) {
        alert(response.data.message);
        setShowModal(true);
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      console.error("Error claiming food:", error);
      alert(
        `Error: ${error.response.data.message} \n Redirecting to page where food items that are available for claim`
      );
      navigate("/ngo-request");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="min-h-screen bg-[#f8f6f0] px-6 py-8 flex flex-col items-center">
      <div className="relative w-full max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={(map) => (mapRef.current = map)}
          options={{ gestureHandling: "greedy", zoomControl: true }}
        >
          {traveledPath.length > 0 && (
            <Polyline
              path={traveledPath}
              options={{ strokeColor: "#808080", strokeWeight: 6 }}
            />
          )}
          {routePath.length > 0 && (
            <Polyline
              path={routePath.slice(traveledPath.length)}
              options={{ strokeColor: "#00008B", strokeWeight: 6 }}
            />
          )}

          {deliveryStarted && (
            <Marker
              position={currentLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: dotScale,
                fillColor: "blue",
                fillOpacity: 1,
                strokeWeight: 0,
              }}
            />
          )}
          <Marker position={destination} />
        </GoogleMap>

        <button
          onClick={onConfirmOrder}
          className="absolute bottom-5 right-15 bg-[#13333E] text-white text-md font-semibold px-6 py-3 rounded-full shadow-md cursor-pointer"
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>

        <button
          onClick={onConfirmOrder}
          className="absolute bottom-5 left-10 bg-[#13333E] text-white text-md font-semibold px-6 py-3 rounded-full shadow-md cursor-pointer"
        >
          Contact Donor
        </button>
      </div>

      <div className="w-full px-40 flex justify-between mt-6 bg-transparent p-6">
        <div>
          <p className="text-2xl font-medium mt-2">
            <span className="text-xl text-gray-600">Donor: </span>{" "}
            <span className="font-semibold">{donor.name}</span>
          </p>
          <p className="text-lg font-medium mt-2">
            <span className="text-xl text-gray-600">Donor address : </span>
            {donorLocation?.street}, {donorLocation?.city} ,{" "}
            {donorLocation?.state} , {donorLocation?.pincode}
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">
            <span className="text-xl font-medium text-gray-600">
              Food item :{" "}
            </span>{" "}
            <span className="ml-2">
              {foodItem.foodName.charAt(0).toUpperCase() +
                foodItem.foodName.slice(1)}
            </span>{" "}
            <span className="text-sm font-normal text-gray-600">
              ({foodItem.foodType})
            </span>
          </p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">
            <span className="text-lg text-gray-600">Food quantity : </span>
            {foodItem.totalQuantity}
            <span className="pl-1 text-sm font-normal text-gray-800">
              {" "}
              {foodItem.totalQuantity > 10 ? "unit" : "kg"}
            </span>{" "}
          </p>
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Your item is out for delivery!
            </h2>
            <p className="text-gray-700">
              You are being redirected to live tracking section.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                startDelivery();
              }}
              className="mt-4 bg-[#13333E] text-white px-5 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoClaim;
