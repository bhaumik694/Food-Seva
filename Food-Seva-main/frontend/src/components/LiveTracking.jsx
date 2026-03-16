import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const containerStyle = { width: "100%", height: "500px" };

const pickupLocation = { lat: 19.076, lng: 72.8777 };
const destination = { lat: 19.0809, lng: 72.8553 };

const libraries = ["places"];

const LiveTracking = () => {
  const [currentLocation, setCurrentLocation] = useState(pickupLocation);
  const [routePath, setRoutePath] = useState([]);
  const [traveledPath, setTraveledPath] = useState([]);
  const [deliveryStarted, setDeliveryStarted] = useState(false);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [eta, setEta] = useState(null);
  const [speed, setSpeed] = useState(10);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [dotScale, setDotScale] = useState(10);
  const [initialDistance, setInitialDistance] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (!isLoaded) return;

    const fetchRoute = async () => {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: { departureTime: new Date(), trafficModel: "bestguess" },
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const path = result.routes[0].overview_path;
            setRoutePath(path);

            const leg = result.routes[0].legs[0];
            const totalDistance = leg.distance.value / 1000;
            const totalTime = leg.duration.value;

            setEta(totalTime);
            setInitialDistance(totalDistance);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    };

    fetchRoute();
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || routePath.length === 0 || !mapRef.current) return;

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickupLocation);
    bounds.extend(destination);

    mapRef.current.fitBounds(bounds);
  }, [isLoaded, routePath]);

  const startDelivery = () => {
    setDeliveryStarted(true);
    socket.emit("startDelivery");
    setRemainingDistance(initialDistance);
  };

  useEffect(() => {
    if (!deliveryStarted || routePath.length === 0) return;

    let index = 0;
    const totalDistance = window.google.maps.geometry.spherical.computeLength(routePath) / 1000;
    const validSpeed = speed > 0 ? speed : 10;
    const intervalTime = (totalDistance * 1000) / (routePath.length * validSpeed) * 1000;

    const moveVehicle = setInterval(() => {
      if (index < routePath.length) {
        const newLocation = routePath[index];
        setCurrentLocation(newLocation);
        setTraveledPath((prev) => [...prev, newLocation]);

        const traveledDistance = (index / routePath.length) * totalDistance;
        const newRemainingDistance = Math.max(0, totalDistance - traveledDistance);
        setRemainingDistance(newRemainingDistance);

        if (validSpeed > 0) {
          setEta(Math.round((newRemainingDistance * 1000) / validSpeed));
        }

        index++;
      } else {
        clearInterval(moveVehicle);
        setDeliveryCompleted(true);
        setRemainingDistance(0);
        setEta(0);
      }
    }, intervalTime);

    return () => clearInterval(moveVehicle);
  }, [deliveryStarted, routePath, speed]);

  useEffect(() => {
    if (!deliveryStarted) return;

    const blinkInterval = setInterval(() => {
      setDotScale((prevScale) => (prevScale === 10 ? 9 : prevScale === 9 ? 8 : 10));
    }, 500);

    return () => clearInterval(blinkInterval);
  }, [deliveryStarted]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <button onClick={startDelivery} className="my-10 p-2 bg-amber-400">
        Start Delivery
      </button>

      {eta !== null && <p className="text-blue-600 text-lg font-bold">ETA: {Math.floor(eta / 60)} min {eta % 60} sec</p>}
      {initialDistance !== null && <p className="text-purple-500">Total Distance: {initialDistance.toFixed(2)} km</p>}

      {deliveryStarted && (
        <>
          <p className="text-red-500">Speed: {speed} m/s</p>
          <p className="text-purple-500">Distance Remaining: {remainingDistance.toFixed(2)} km</p>
        </>
      )}

      {deliveryCompleted && <p className="text-green-600 text-lg font-bold">Delivery Successful 🎉</p>}

      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={(map) => (mapRef.current = map)}
        center={pickupLocation}
        zoom={14}
      >
        {traveledPath.length > 0 && (
          <Polyline path={traveledPath} options={{ strokeColor: "#808080", strokeOpacity: 1.0, strokeWeight: 6 }} />
        )}

        {routePath.length > 0 && (
          <Polyline path={routePath.slice(traveledPath.length)} options={{ strokeColor: "#00008B", strokeOpacity: 1.0, strokeWeight: 6 }} />
        )}

        <Marker position={pickupLocation} />

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
    </div>
  );
};

export default LiveTracking;
