import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

export default function Register() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [role, setRole] = useState("donor");
  const [address, setAddress] = useState({});

  const [coordinates, setCoordinates] = useState(null);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const Navigate = useNavigate();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({
    Username: "",
    email: "",
    phone: "",
    password: "",
    role: role,
    ngoNumber: "",
    address: "",
    termsAgreed: false,
  });
  const handleOnChange = (index, e) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      if (index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };
  const handleLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        setAddress(response.data);
        console.log("Address:", response.data);
      } catch (error) {
        console.error("Error fetching address:", error);
      }

      setCoordinates({ lat: latitude, lng: longitude });
    });
  };
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const {
      Username,
      email,
      phone,
      password,
      role,
      ngoNumber,
      rememberMe,
      termsAgreed,
    } = formData;
    if (!Username || !email || !phone || !password || !role || !termsAgreed) {
      alert("Please fill all the fields");
      return;
    }
    axios
      .post("http://localhost:5000/api/auth/sendOtp", { phone })
      .then((response) => {
        if (response.status === 200) {
          setShowOtpModal(true);
        } else {
          alert("Error Wrong OTP");
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setShowOtpModal(true);
  }
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verifyOtp",
        {
          phone: "+91" + formData.phone,
          otp: otp.join(""),
        }
      );

      if (response.data.success) {
        alert("OTP Verified Successfully!");
        try {
          const user = {
            name: formData.Username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            registeredNumber: formData.ngoNumber,
            address: {
              street: address.address.suburb,
              city: address.address.city,
              state: address.address.state,
              pincode: address.address.postcode,
              coordinates: coordinates,
            },
            role: role,
          };
          const response = await axios.post(
            "http://localhost:5000/api/auth/signup",
            user
          );

          if (response.status === 201) {
            alert("Registered Successfully!");
            Navigate("/login");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#eeecdd]">
        <form
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-2">Create account</h2>
          <p className="text-gray-500 mb-4">For business, band or celebrity.</p>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="Username"
              placeholder={role === "donor" ? "Username" : "NGO Name"}
              value={formData.Username}
              onChange={handleChange}
              className="input-field p-2 rounded-md border-2  border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field p-2 rounded-md border-2  border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 mb-3">
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="input-field p-2 rounded-md border-2  border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field p-2 rounded-md border-2  border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          {role === "ngo" ? (
            <input
              type="text"
              name="ngoNumber"
              placeholder="Registered NGO Number"
              value={formData.ngoNumber}
              onChange={handleChange}
              className="input-field p-2 rounded-md border-2 w-full border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            ""
          )}

          <div className="mb-4 py-4">
            <label className="block text-gray-700 font-bold mb-2">
              Login as:
            </label>
            <div className="flex space-x-4 justify-between">
              <div className="flex gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="donor"
                    checked={role === "donor"}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-radio"
                  />
                  <span>Donor</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="ngo"
                    checked={role === "ngo"}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-radio"
                  />
                  <span>NGO</span>
                </label>
              </div>
              <button
                onClick={handleLocation}
                className="bg-gray-700 cursor-pointer text-white p-3 rounded-md"
              >
                {" "}
                Get Location
              </button>
            </div>
          </div>
          {coordinates && <p>Address: {address.display_name}</p>}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleChange}
              required
            />
            <label className="ml-2 text-gray-600">
              I agree to all the{" "}
              <a href="#" className="text-blue-600">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600">
                Privacy policy
              </a>
            </label>
          </div>

          <a href="" className="text-blue-600 text-sm block mt-2 mb-2">
            Forgot password?
          </a>
          <div className="flex justify-around">
            <button
              type="submit"
              className="btn-primary mt-2  bg-gray-700 cursor-pointer text-white p-3 rounded-md"
            >
              Create account
            </button>

            <button className="btn-secondary mt-2 flex items-center justify-center bg-gray-700 text-white p-3 rounded-md">
              <img
                src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign-in with Google
            </button>
          </div>

          <p className="text-center mt-4 text-gray-600">
            Already having an account?{" "}
            <a href="#" className="text-blue-600">
              Log In
            </a>
          </p>
        </form>
      </div>
      <Modal
        isOpen={showOtpModal}
        onRequestClose={() => setShowOtpModal(false)}
        appElement={document.getElementById("root")}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto z-[100]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]"
      >
        <h2 className="text-lg font-bold mb-4">OTP Verification</h2>

        <div className="flex space-x-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleOnChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => setShowOtpModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
        </div>
      </Modal>
    </>
  );
}
