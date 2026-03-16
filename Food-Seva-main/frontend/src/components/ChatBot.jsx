import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chatbot from "../assets/chatbot.png";
import axios from "axios";
const ChatAI = () => {
  const [input, setInput] = useState("");
  const [humanMessages, setHumanMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    axios
      .post("http://localhost:8080/chat", { user_input: input })
      .then((response) => {
        const aiResponse = response.data.response;
        console.log(aiResponse);
        setAiMessages((prev) => [...prev, aiResponse]);
      });
    setHumanMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed flex bottom-5 right-5 bg-[#13333E] text-white space-x-4 p-3 rounded-full shadow-lg hover:bg-[#1a282c] transition z-50 cursor-pointer"
      >
        <img src={chatbot} alt="" className="w-10 rounded-full border-none" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-transparent bg-opacity-90 backdrop-blur-xs flex justify-center items-center p-4 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white w-full max-w-lg h-[90%] rounded-2xl shadow-lg flex flex-col overflow-hidden z-[9999]"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#1a282c] text-white text-lg p-4 flex justify-between items-center">
                <span className="font-semibold">DaanBot</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white cursor-pointer text-lg"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
                {humanMessages.map((message, index) => (
                  <React.Fragment key={index}>
                    <div className="flex justify-end">
                      <div className="bg-black text-white p-3 rounded-lg max-w-xs shadow-md">
                        {message}
                      </div>
                    </div>
                    {aiMessages[index] && (
                      <div className="flex justify-start">
                        <div className="bg-[#1a282c] text-white p-3 rounded-lg max-w-xs shadow-md">
                          {aiMessages[index]}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="bg-white flex items-center border-t p-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex w-full p-3 bg-gray-200 text-black rounded-lg outline-none"
                  placeholder="Write your question..."
                />
                <button
                  onClick={handleSend}
                  className="bg-[#13333E] text-white p-3 ml-2 rounded-lg cursor-pointer hover:bg-[#1a282c] transition"
                >
                  ➤
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatAI;
