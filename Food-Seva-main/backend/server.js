import express from "express";
import connectDB from "../backend/config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import polyline from "polyline";

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const pickupLocation = { lat: 19.076, lng: 72.8777 };
const destination = { lat: 19.081, lng: 72.841 };

let routeCoordinates = [];
let currentIndex = 0;

connectDB();

async function fetchRoute() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLocation.lat},${pickupLocation.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}`;

    const response = await axios.get(url);

    console.log("🔍 Full API Response:", response.data);

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error("No routes found in API response.");
    }

    const steps = response.data.routes[0].legs[0].steps;

    routeCoordinates = steps.flatMap((step) =>
      polyline.decode(step.polyline.points).map(([lat, lng]) => ({ lat, lng }))
    );

    console.log("Route Loaded:", routeCoordinates.length, "points");
  } catch (error) {
    console.error("Error fetching route:", error.message);
  }
}

function moveDelivery() {
  if (routeCoordinates.length === 0) return;

  const interval = setInterval(() => {
    if (currentIndex >= routeCoordinates.length) {
      clearInterval(interval);
      console.log("Delivery Completed!");
      io.emit("locationUpdated", destination);
      return;
    }

    io.emit("locationUpdated", routeCoordinates[currentIndex]);
    currentIndex++;
  }, 1000);
}

io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id);

  socket.on("startDelivery", () => {
    console.log("Delivery Started!");
    moveDelivery();
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/claims", claimRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await fetchRoute(); // Load route when server starts
});
