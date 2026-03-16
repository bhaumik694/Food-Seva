import jwt from "jsonwebtoken";
import Donor from "../models/donorModel.js";
import NGO from "../models/ngoModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    console.log("Authorization header:", req.headers.authorization);

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log("Decoded Token:", decoded);

            if (decoded.role !== 'donor' && decoded.role !== 'ngo') {
              return res.status(400).json({ message: "Invalid role in token" });
            }

            req.user = await (decoded.role === "donor" ? Donor : NGO).findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized" });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: "Token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

