import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NgoHomeImg from "../assets/NgoRequestImage.svg";
import { Loader2 } from "lucide-react";

const calculateDistance = (pickup, ngo) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const R = 6371; // Radius of Earth in km
  const lat1 = toRadians(pickup.lat);
  const lon1 = toRadians(pickup.lng);
  const lat2 = toRadians(ngo.lat);
  const lon2 = toRadians(ngo.lng);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

const NgoRequest = () => {
  const [search, setSearch] = useState("");
  const [availableFood, setAvailableFood] = useState([]);
  const [ngoLocation, setNgoLocation] = useState({
    lat: 28.7041,
    lng: 77.1025,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.address?.coordinates) {
          setNgoLocation({
            lat: userData.address.coordinates.lat,
            lng: userData.address.coordinates.lng,
          });
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/food/available-food")
      .then((response) => {
        setAvailableFood(response.data.availableFood);
      })
      .catch((error) => {
        console.error("Error fetching food:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("Updated Available Food:", availableFood);
  }, [availableFood]);

  return (
    <div className="bg-[#FAF3E0] min-h-screen px-6 pl-6">
      <img
        src={NgoHomeImg}
        className="mx-auto bg-cover bg-center w-[80%] h-[80%] p-5"
        alt=""
      />

      {/* Search Bar */}
      <div className="relative w-[73%] mx-auto">
        <input
          type="text"
          placeholder="Search for food banks or restaurants"
          className="w-full bg-[#132D3E] text-white px-4 py-3 rounded-xl pl-10 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-4 text-gray-400" />
      </div>

      <h2 className="text-xl font-bold mt-10 ml-52">Nearby Food Donations</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40 min-h-88 gap-5">
          <Loader2 className="h-10 w-10 animate-spin" />
          <div className="text-lg">Loading donations, please wait...</div>
        </div>
      ) : availableFood.length === 0 ? (
        <div className="flex justify-center items-center h-40 min-h-52">
          <p className="text-gray-500 text-lg font-semibold">
            No donations found at this moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 max-w-[75%] mx-auto">
          {availableFood.flatMap((donation) =>
            donation.foodItems.map((foodItem) => (
              <div
                onClick={() =>
                  navigate("/ngo-claim", {
                    state: {
                      donateFoodId: donation._id,
                      foodItem,
                      donor: donation.donor,
                      pickupLocation: donation.pickupLocation.coordinates,
                      donorLocation: donation.pickupLocation,
                    },
                  })
                }
                key={foodItem._id}
                className="rounded-2xl transition-transform transform hover:scale-105 w-full flex flex-col gap-3 h-96 cursor-pointer"
              >
                <img
                  src={foodItem.imgUrl}
                  alt={foodItem.foodName}
                  className="rounded-xl w-full h-60 object-cover"
                />
                <div className="flex justify-between">
                  <div className="pl-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {foodItem.foodName.charAt(0).toUpperCase() +
                          foodItem.foodName.slice(1)}
                      </h3>
                      <p className="text-xs text-gray-700 items-center">
                        ({foodItem.foodType})
                      </p>
                    </div>
                    <p className="text-[#13333E] font-bold text-md">
                      Donor: {donation.donor.name}
                    </p>
                    <p className="text-[#13333E] text-sm">
                      {donation.pickupLocation.street},{" "}
                      {donation.pickupLocation.city}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[#13333E] text-md font-semibold self-center">
                      {calculateDistance(
                        donation.pickupLocation.coordinates,
                        ngoLocation
                      )}{" "}
                      km away
                    </p>
                    <button className="bg-[#13333E] cursor-pointer text-white text-sm font-semibold px-4 py-2 mt-2 transition duration-200 rounded-br-xl self-end">
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NgoRequest;
