import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchData(storedUser);
    }
  }, []);

  const fetchData = async (user) => {
    try {
      const endpoint =
        user.role === "donor"
          ? `http://localhost:5000/api/donations/${user._id}`
          : `http://localhost:5000/api/claims/${user._id}`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
    setRewards(user.rewards);
  };

  let serialNumber = 1;

  const renderRow = (item) => {
    console.log("Item retreifh", item);
    const foodItems = Array.isArray(item.foodItems) ? item.foodItems : [];
    console.log("Food Items", foodItems);
    if (user?.role === "donor") {
      return foodItems.map((food) => (
        <tr key={`${item._id}-${food.foodName}`} className="text-gray-700">
          <td className="border border-gray-300 px-4 py-2 text-center">
            {serialNumber++}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-center">
            {food.foodName} ({food.foodType})
          </td>
          <td className="border border-gray-300 px-4 py-2 text-center">
            {new Date(item.createdAt).toLocaleDateString()}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-center">
            {food.status === "Available" ? (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-sm">
                🚚 Avaliable
              </span>
            ) : food.status === "Claimed" ? (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm">
                ✅ Claimed
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-sm">
                ❌ Expired
              </span>
            )}
          </td>
        </tr>
      ));
    } else {
      return item.claimedItems.map(
        (food) => (
          console.log("food", food),
          (
            <tr
              key={`${item._id}-${food.foodName}`}
              className="odd:bg-gray-100 even:bg-white text-gray-800 hover:bg-gray-200 transition"
            >
              <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                {serialNumber++}
              </td>

              <td className="border border-gray-300 px-4 py-3 text-center flex gap-2 justify-center items-center font-semibold">
                {food.foodName.charAt(0).toUpperCase() + food.foodName.slice(1)}
                <span className="text-gray-600">
                  ({food.claimedQuantity}{" "}
                  {food.claimedQuantity > 18 ? "units" : "kg"})
                </span>
              </td>

              <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-700">
                {new Date(item.claimedAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                {item.deliveryTracking?.completed ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm">
                    ✅ Delivered
                  </span>
                ) : item.deliveryTracking?.started ? (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-sm">
                    🚚 Out for Delivery
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-sm">
                    ⏳ Pending
                  </span>
                )}
              </td>
            </tr>
          )
        )
      );
    }
  };

  return (
    <div className="min-h-screen mt-10 bg-transparent p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.role === "donor" ? "Your Donations" : "Your Claims"}
          </h1>
          {/* {user?.role === "donor" ? (
            <h1 className="text-2xl font-bold text-gray-800">
              Your rewards: {rewards}
            </h1>
          ) : (
            ""
          )} */}
        </div>

        {loading ? (
          <p className="text-gray-600 mt-4">Loading...</p>
        ) : (
          <div className="mt-6">
            {data.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 text-center">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Sr No.</th>
                    <th className="border border-gray-300 px-4 py-2">
                      {user?.role === "donor" ? "Food Items" : "Claim Details"}
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => renderRow(item, index))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 text-center mt-4">
                {user?.role === "donor"
                  ? "No donations found."
                  : "No claims found."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
