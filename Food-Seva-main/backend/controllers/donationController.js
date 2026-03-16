import { ethers } from "ethers";
import DonorFood from "../models/foodItemModel.js";

export const getDonations = async (req, res) => {
  console.log(req.params.donorId);
  try {
    const donations = await DonorFood.find({ donor: req.params.donorId });
    console.log(donations);
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "donationId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "FoodClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "foodDetails",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "FoodDonated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "donationId",
        type: "uint256",
      },
    ],
    name: "claimFood",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "claimedDonations",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "foodDetails",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    name: "donateFood",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "donations",
    outputs: [
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        internalType: "string",
        name: "foodDetails",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "claimed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllDonations",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bool[]",
        name: "",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getDonation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDonationsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
export const recordOnChain = async (req, res) => {
  try {
    const { foodDetails, quantity, location } = req.body;
    const tx = await contract.donateFood(foodDetails, quantity, location);
    await tx.wait();
    res.json({ message: "Food donation recorded on blockchain!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDonationsFromChain = async (req, res) => {
  try {
    const [
      donors,
      foodDetails,
      quantities,
      locations,
      timestamps,
      claimedStatuses,
    ] = await contract.getAllDonations();
    const numDonations = donors.length;
    const formattedDonations = [];
    for (let i = 0; i < numDonations; i++) {
      formattedDonations.push({
        id: i,
        donor: donors[i],
        foodDetails: foodDetails[i],
        quantity: Number(quantities[i]),
        location: locations[i],
        timestamp: Number(timestamps[i]),
        claimed: claimedStatuses[i],
      });
    }

    res.json({ donations: formattedDonations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching donations" });
  }
};
