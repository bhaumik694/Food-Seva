import { useState, useEffect } from "react";
import Modal from "react-modal";
import "@fontsource/space-grotesk";

const complianceChecks = [
  {
    id: 1,
    label: "Labeling and packaging meets regulatory standards",
    link: "https://westregion.fssai.gov.in/Save-Food-Share-Food.php",
  },
  {
    id: 2,
    label: "Hygiene protocols for food preparation",
    link: "https://nutritionconnect.org/food-safety-standards-authority-india-fssai-guiding-optimisation-surplus-food-donation",
  },
  {
    id: 3,
    label: "Licensing and registration validity",
    link: "https://sharefood.eatrightindia.gov.in/pdf/Surplus-food-draft-regulation.pdf",
  },
  {
    id: 4,
    label: "Storage conditions compliance",
    link: "https://westregion.fssai.gov.in/pdf/share-food.pdf",
  },
  { id: 5, label: "All ingredients and additives are approved", link: "#" },
];

const Fssai = ({ isOpen, onClose, onConfirm }) => {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (isOpen) {
      setCheckedItems({});
    }
  }, [isOpen]);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = complianceChecks.every((item) => checkedItems[item.id]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-6"
      overlayClassName="fixed inset-0 backdrop-blur-xs bg-opacity-50"
    >
      <div className="bg-[#EEecdd] backdrop-blur-lg mt-36 border border-white/20 rounded-xl z-50 p-10 max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-[#13333E] text-center mb-2 tracking-wide">
          Ensuring FSSAI Compliance
        </h1>
        <p className="text-lg text-[#DBB46E] text-center mb-8">
          Read the guidelines and verify compliance before submitting.
        </p>

        <form className="space-y-3">
          {complianceChecks.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/10 px-5 py-4 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <label className="flex items-center space-x-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-6 h-6 accent-[#13333d] bg-gray-900 rounded-md border border-gray-400 focus:ring-2 focus:ring-[#13333d] transition-all"
                  checked={checkedItems[item.id] || false}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <span className="text-[#13333d] text-lg">{item.label}</span>
              </label>
              <a
                href={item.link}
                className="text-[#38bdf8] text-1x1 font-semibold hover:underline"
              >
                Read More
              </a>
            </div>
          ))}

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition-all"
            >
              ❌ Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-xl font-bold shadow-md transition-all ${
                allChecked
                  ? "bg-[#13333d] text-white hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!allChecked}
            >
              ✅ Verify & Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Fssai;
