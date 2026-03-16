import  { useState, useEffect, useRef } from "react";
import PopUps from "./PopUps";
import Pages from "./Pages";
import OurNetworks from "./OurNetworks.jsx";
import JoinMovement from "./JoinMovement.jsx";
import poverty from "../../assets/Home/poverty.png";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";

const Home = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState("");
  const [secondPoint, setSecondPoint] = useState({
    lat: 19.076,
    lng: 72.8777,
    name: "Predefined Location (Mumbai)",
  });

  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            setAddress(response.data.display_name);
            localStorage.setItem("address", response.data.display_name);
            console.log("Address:", response.data.display_name);
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        });
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;

    const map = mapRef.current;
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(latitude, longitude),
        L.latLng(secondPoint.lat, secondPoint.lng),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [latitude, longitude]);

  const initialText =
    "Join us in bridging the gap between surplus food and those in need, ensuring nourishment reaches every corner of our society.";

  return (
    <>
      <div className="bg-[#eeecdd]">
        <div className=" relative w-full h-full overflow-hidden align-center bg-[#eeecdd]">
          <div
            className="items-center absolute inset-0 mt-10 rounded-xl mx-auto bg-cover bg-center w-[80%] h-[80%] p-10 brightness-30"
            style={{ backgroundImage: `url(${poverty})` }}
          ></div>

          <div className="relative w-fit z-10 mx-auto text-white flex flex-col gap-16 justify-center items-center h-screen text-center">
            <div className="flex flex-col w-fit items-center ">
              <h1 className="text-6xl font-extrabold w-3/4">
                Transforming food excess into community support.
              </h1>
              <p className="text-[1.6em] mt-10 mx-4 text-white max-w-[80%]  font-medium">
              {initialText}
              </p>
            </div>
            <div className="mt-6 flex space-x-4 ">
              <button className="bg-[#13333E] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#1a282c] transition">
                <a href="/about">Learn More</a>
              </button>
              <button className="bg-white text-black font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center ">
          <PopUps />
        </div>
        <div>
          <Pages />
        </div>
        <div className="">
          <OurNetworks />
        </div>
        <div className=" p-20 flex flex-col justify-center">
          <JoinMovement />
        </div>
      </div>
    </>
  );
};

export default Home;