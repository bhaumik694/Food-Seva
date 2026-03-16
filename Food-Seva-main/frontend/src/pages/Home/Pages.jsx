import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    icon: "✏️",
    title: "Register Your Surplus",
    description:
      "Easily list your excess food, from produce to prepared meals.",
    reverse: false,
  },
  {
    icon: "📦",
    title: "We Connect and Distribute",
    description:
      "Our platform finds nearby organizations that can utilize your donation, coordinating efficient and timely distribution.",
    reverse: true,
  },
  {
    icon: "📊",
    title: "Track Your Impact",
    description:
      "Gain insights into the positive impact of your contributions through detailed reports.",
    reverse: false,
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0.2 1", "0.8 0"],
  });

  return (
    <div ref={ref} className="w-full bg-[#eeecdd] py-20 px-10">

      <motion.h2
        className="text-4xl font-extrabold mb-16 text-center"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6], [0, 1, 1, 1]),
          y: useTransform(scrollYProgress, [0, 0.1, 0.3, 0.5], [50, 0, 0, -50]),
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        How It Works
      </motion.h2>

      <div className="flex flex-col items-center space-y-20">
        {steps.map((step, index) => {

          const start = 0.1 + index * 0.1;
          const end = start + 0.4;

          const opacity = useTransform(scrollYProgress, [start, start + 0.1, end, end + 0.2], [0, 1, 1, 0]);
          const y = useTransform(scrollYProgress, [start, start + 0.1, end, end + 0.2], [50, 0, 0, -50]);

          return (
            <motion.div
              key={index}
              className={`w-[80%] flex items-center ${step.reverse ? "flex-row-reverse text-right" : "flex-row text-left"} space-x-6`}
              style={{ opacity, y }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >

              <span className="text-3xl bg-white p-4 rounded-full shadow-md">{step.icon}</span>

              <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
                <h3 className="font-bold text-2xl">{step.title}</h3>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;