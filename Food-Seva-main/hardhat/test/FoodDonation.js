const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FoodDonation Contract", function () {
  let FoodDonation, foodDonation, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    FoodDonation = await ethers.getContractFactory("FoodDonation");
    foodDonation = await FoodDonation.deploy();
    await foodDonation.waitForDeployment();
  });

  it("Should allow users to donate food", async function () {
    await foodDonation.connect(addr1).donateFood("Paneer Tikka Masala", 1, "Mumbai");

    const donations = await foodDonation.getAllDonations();
    expect(donations[0].length).to.equal(1);
    expect(donations[1][0]).to.equal("Paneer Tikka Masala");
    expect(donations[2][0]).to.equal(1);
    expect(donations[3][0]).to.equal("Mumbai");
    expect(donations[5][0]).to.equal(false);
  });

  it("Should allow multiple donations", async function () {
    await foodDonation.connect(addr1).donateFood("Rice Packets", 2, "Delhi");
    await foodDonation.connect(addr2).donateFood("Bread & Butter", 3, "Bangalore");

    const donations = await foodDonation.getAllDonations();
    expect(donations[0].length).to.equal(2);
    expect(donations[1][0]).to.equal("Rice Packets");
    expect(donations[1][1]).to.equal("Bread & Butter");
  });

  it("Should allow claiming a donation", async function () {
    await foodDonation.connect(addr1).donateFood("Milk", 5, "Pune");

    let donations = await foodDonation.getAllDonations();
    expect(donations[5][0]).to.equal(false);

    await foodDonation.connect(addr2).claimFood(0);
    donations = await foodDonation.getAllDonations();
    expect(donations[5][0]).to.equal(true);
  });

  it("Should revert if trying to claim an already claimed donation", async function () {
    await foodDonation.connect(addr1).donateFood("Biscuits", 10, "Chennai");
    await foodDonation.connect(addr2).claimFood(0);

    await expect(foodDonation.connect(addr1).claimFood(0)).to.be.revertedWith("Already claimed");
  });

  it("Should revert if trying to claim an out-of-bounds index", async function () {
    await expect(foodDonation.claimFood(999)).to.be.revertedWith("Invalid donation ID");
  });
});
