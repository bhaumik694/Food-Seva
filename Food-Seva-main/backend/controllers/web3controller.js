import Donor from "../models/donorModel.js"
import dotenv from "dotenv"
import { tokenContract, provider, wallet } from "../config/web3.js"
import { ethers } from "ethers"
import fetch from "node-fetch"
import twilio from "twilio"
import mongoose from "mongoose"

dotenv.config()

async function getEthToInrRate() {
  const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr");
  const data = await response.json();
  return data.ethereum.inr;
}

const loginwithweb3 = async (req, res) => {
  try {
    const { email } = req.body;
    let existingUser = await Donor.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (existingUser.wallet) {
      return res.status(200).json({ message: "Good to go", wallet: existingUser.address });
    }
    const wallet = ethers.Wallet.createRandom();
    let changedUser = await Donor.findOneAndUpdate({ email: email }, { wallet: wallet.address, privateKey: wallet.privateKey });
    await changedUser.save();

    res.status(200).json({ message: "Wallet created", wallet: wallet.address });
  } catch (error) {
    res.status(500).json({ message: "Error creating wallet", error: error.message });
  }
}

const reward = async (req, res) => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const { id } = req.body;
    const amountEth = 0.006;
    const user = await Donor.findById(new mongoose.Types.ObjectId(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const ethToInrRate = await getEthToInrRate();
    const amountInr = amountEth * ethToInrRate;
    const tx = await tokenContract.transfer(user.wallet, ethers.parseUnits(amountEth.toString(), "ether"));
    await tx.wait();
    const updatedUser = await Donor.findOneAndUpdate({ email: user.email }, { rewards: user.rewards + amountInr });
    client.messages
      .create({
        body: "Your Donation Was Successfully Received by the NGO. Reward Has Been Sent To Your Wallet",
        from: process.env.TWILIO_PHONENUMBER,
        to: "+91"+user.phone,
      })
      .then((message) => console.log("Message sent! SID:", message.sid))
      .catch((error) => console.error("Error sending message:", error));
    res.json({ message: "Reward sent", txHash: tx.hash, donor: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Reward transfer failed", error: error.message });
  }
}

export { loginwithweb3, reward }