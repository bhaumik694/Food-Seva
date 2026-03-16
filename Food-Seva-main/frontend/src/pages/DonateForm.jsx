import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Carrot, Beef, CalendarRange, Package, Factory } from "lucide-react";
import Fssai from "./Modals/Fssai";

const foodTypes = [
  "Processed food",
  "Vegetables",
  "Packed food",
  "Perishables",
  "Meat",
];

const DonateForm = () => {
  const [address, setAddress] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [responseURl, setResponseURl] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const [uploadedImages, setUploadedImages] = useState({});
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    name: "",
    expiryDate: null,
    imgUrl: "",
  });

  const [donatedItems, setDonatedItems] = useState([]);
  const [pickupLocation, setPickupLocation] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getFoodIcon = (foodType) => {
    const icons = {
      Vegetables: <Carrot className="text-gray-700 w-6 h-6" />,
      "Processed food": <Factory className="text-gray-700 w-6 h-6" />,
      "Packed food": <Package className="text-gray-700 w-6 h-6" />,
      Perishables: <CalendarRange className="text-gray-700 w-6 h-6" />,
      Meat: <Beef className="text-gray-700 w-6 h-6" />,
    };
    return icons[foodType] || null;
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    if (formData.foodType && formData.quantity && formData.name) {
      setDonatedItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          foodType: formData.foodType,
          foodName: formData.name,
          totalQuantity: formData.quantity,
          expiryDate: formData.expiryDate,
        },
      ]);

      setFormData({ foodType: "", quantity: "", name: "", expiryDate: "" });
    }
  };

  const handleRemoveItem = (id) => {
    setDonatedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGetLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        setLoadingLoc(true);
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        setAddress(response.data);
        console.log("Address:", response.data);
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoadingLoc(false);
      }
      setPickupLocation({ lat: latitude, lng: longitude });
    });
  };
  const handleUploadFood = (e) => {
    if (donatedItems.length === 0) {
      alert("No donated items found!");
      return;
    } else {
      setModalOpen(true);
      setDonatedItems;
    }
  };
  const handleSubmitFood = async () => {
    console.log(donatedItems);

    if (Object.keys(uploadedImages).length === 0) {
      alert("Please select images first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.values(uploadedImages).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const uploadResponse = await axios.post(
        "http://localhost:8080/uploadoncloud",
        formData
      );
      const uploadedPredictions = uploadResponse.data.predictions;

      const uploadedImagesUrls = uploadedPredictions.map(
        (item) => item.image_url
      );
      const freshnessResults = uploadedPredictions.map(
        (item) => item.prediction
      );

      const staleItems = donatedItems.filter(
        (_, index) => freshnessResults[index] !== "Fresh"
      );
      if (staleItems.length > 0) {
        const userChoice = window.confirm(
          "Some food items are stale! \nDo you want to proceed without them?"
        );

        if (!userChoice) {
          setLoading(false);
          return;
        }
      }

      const filteredItems = donatedItems
        .map((item, index) => ({
          ...item,
          imgUrl: uploadedImagesUrls[index] || "",
        }))
        .filter((_, index) => freshnessResults[index] === "Fresh"); // Remove stale items

      if (filteredItems.length === 0) {
        alert("No fresh food remains to proceed!");
        setLoading(false);
        return;
      }

      setDonatedItems(filteredItems);

      await new Promise((resolve) => setTimeout(resolve, 0));
      const data = {
        donor: user?._id, // Donor ID
        foodItems: filteredItems,
        pickupLocation: {
          street: address.address.suburb,
          city: address.address.city,
          state: address.address.state,
          pincode: address.address.postcode,
          coordinates: pickupLocation,
        },
      };

      console.log("Data being sent:", data);

      const response = await axios.post(
        "http://localhost:5000/api/food/upload-food",
        data
      );

      console.log("Backend response:", response.data);

      const sendSms = await axios.post(
        "http://localhost:8080/upload-food",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(sendSms.data);
      setDonatedItems([]);
      alert("Food submitted successfully!");
      setPickupLocation("");
    } catch (error) {
      console.error(
        "Error submitting food:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event, itemId) => {
    const file = event.target.files[0];
    if (file) {
      alert("Image Uploaded Successfully!");
      setUploadedImages((prev) => ({
        ...prev,
        [itemId]: file,
      }));
    }
  };

  return (
    <div className="p-0 mt-5 h-fit px-10 flex justify-between gap-15 pb-2 bg-[#eecdd]">
      <div className="w-xl bg-transparent rounded-lg p-6 flex-1 pr-14 border-r-2">
        <h2 className="text-xl  mb-2 font-bold">Donate Food</h2>
        <p className="text-gray-600 mb-4">
          Help people in need by listing surplus food items for donation.
        </p>
        <form
          onSubmit={handleAddItem}
          className="flex flex-col justify-center "
        >
          <div className="mb-4">
            <label htmlFor="name" className="font-medium text-lg">
              Food Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Food name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:outline-none focus:border-b-black p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="foodType" className="font-medium text-lg">
              Food Type
            </label>
            <select
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className={`w-full border border-gray-300 focus:outline-none  p-2 rounded ${
                formData.foodType ? "text-black" : "text-gray-400"
              }`}
              required
            >
              <option value="">Select food type</option>
              {foodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity " className="font-medium text-lg">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:outline-none focus:border-b-black p-2 rounded"
              required
            />
          </div>

          <div className="bg-transparent rounded-lg">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Expiration Date
            </label>

            <DatePicker
              className="p-2 w-full border border-gray-300 rounded"
              selected={formData.expiryDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, expiryDate: date }))
              }
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              placeholderText="Select Expiry Date"
            />
          </div>

          <button
            type="submit"
            className="w-1/2 cursor-pointer mb-4 mt-4 mx-auto bg-[#13333E] hover:bg-[#1d2d33] text-white p-2 rounded-[24px]"
          >
            Add Item +
          </button>
        </form>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Pickup Location"
            value={address.display_name}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full border border-gray-300 focus:outline-none p-2 rounded"
            disabled
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleUploadFood()}
            className="flex justify-center items-center w-2/3 cursor-pointer bg-[#13333E] text-white p-2 rounded-[24px] hover:bg-[#1d2e34] "
          >
            {loading ? "Model Processing..." : "Upload"}
            {loading && (
              <div className="flex justify-center ">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </button>
          <button
            onClick={handleGetLocation}
            className="flex justify-center items-center w-1/3 cursor-pointer bg-[#13333E] text-white p-2 rounded-[24px] hover:bg-[#1d2e34]"
          >
            {loadingLoc ? "Fetching Location..." : "Get Location"}
            {loadingLoc && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="w-1/2 bg-transparent  rounded-lg p-6  flex flex-col justify-x-center ">
        <h1 className="text-2xl font-bold mb-2 mx-auto">List of Items</h1>
        {donatedItems.length === 0 ? (
          <div className="text-center font-bold text-gray-800 mt-10">
            No items added yet
          </div>
        ) : (
          <div>
            <div className="text-bold text-xl mb-4 text-center  pb-2 ">
              Added Items:
            </div>
            <div className="flex gap-10 items-center"></div>
            <div className="bg-transparent rounded-lg w-full">
              {donatedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-45 p-3 rounded-md  align-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-transparent  p-2 rounded-lg">
                      {getFoodIcon(item.foodType)}
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {item.foodName}
                      </p>
                      <p className="text-sm text-[#B2954C] font-medium">
                        Quantity: {item.totalQuantity} {item.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center ">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, item.id)}
                      className="hidden"
                      id={`fileUpload-${item.id}`}
                    />

                    <label
                      htmlFor={`fileUpload-${item.id}`}
                      className="cursor-pointer text-black bg-transparent border p-1 rounded-sm"
                    >
                      Upload Image
                    </label>

                    {uploadedImages[item.id] && (
                      <p className="mt-2 text-sm text-gray-500">
                        {uploadedImages[item.id].name}
                      </p>
                    )}
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-700 hover:text-black justify-end m-0"
                  >
                    <span className="text-2xl m-0">&times;</span>
                  </button>
                  <br />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <Fssai
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={() => {
            setIsConfirmed(true);
            setModalOpen(false);
            handleSubmitFood();
          }}
        />
      </div>
    </div>
  );
};

export default DonateForm;
