import React, { useState } from "react";
import { motion, useInView } from "framer-motion";

const PopUps = () => {
  const stats = [
    { label: "MEALS DISTRIBUTED", value: 345000 },
    { label: "ORGANISATIONS SUPPORTED", value: 500 },
    { label: "VOLUNTEERS INVOLVED", value: 1300 },
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { margin: "-100px 0px", triggerOnce: false });

  const [counts, setCounts] = useState(stats.map(() => 0));

  React.useEffect(() => {
    if (isInView) {
      const intervals = stats.map((stat, index) => {
        const increment = Math.ceil(stat.value / 90);
        return setInterval(() => {
          setCounts((prevCounts) => {
            const newCounts = [...prevCounts];
            if (newCounts[index] < stat.value) {
              newCounts[index] = Math.min(newCounts[index] + increment, stat.value);
            }
            return newCounts;
          });
        }, 30);
      });

      return () => intervals.forEach((interval) => clearInterval(interval));
    } else {
      setCounts(stats.map(() => 0));
    }
  }, [isInView]);

  return (
    <div ref={ref} className="flex space-x-20 justify-center bg-[#eeecdd] ">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: index % 2 === 0 ? -20 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: index % 2 === 0 ? -20 : 20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="bg-transparent p-6 text-center w-78 bg-opacity-50 border border-gray-500 rounded-lg"
        >
          <p className="font-bold text-black">{stat.label}</p>
          <p className="text-lg font-extrabold text-black">
            {counts[index].toLocaleString() + "+"}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default PopUps;