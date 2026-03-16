import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-[#eeecdd] text-black flex flex-col items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-4xl md:text-5xl pb-2 font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-black
         to-black">
          Bridging Surplus to Need
        </h1>
        <p className="text-lg md:text-xl text-black max-w-3xl mx-auto">
          We ensure that excess food reaches those in need, reducing waste and fighting hunger through seamless technology and real-time tracking.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="p-6 rounded-2xl bg-white backdrop-blur-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2 text-[#13333d]">{feature.title}</h3>
            <p className="text-black text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4 text-[#13333d]">Join Us</h2>
        <p className="text-black mb-6 max-w-xl">
          Whether you are a donor, NGO, or volunteer, be part of the change and help make a difference.
        </p>
        <a
          href="/get-involved"
          className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#13333d] to-[#13333d] rounded-xl shadow-lg hover:scale-105 transition"
        >
          Get Involved
        </a>
      </motion.div>
    </div>
  );
}

const features = [
  {
    title: "Seamless Food Donation",
    description: "Easily list surplus food and ensure zero wastage.",
  },
  {
    title: "Real-Time Tracking",
    description: "NGOs can track live deliveries just like Swiggy/Zomato.",
  },
  {
    title: "Impact at Scale",
    description: "Redirecting excess food to those in need, reducing hunger.",
  },
];

