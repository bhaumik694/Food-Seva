const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardToken", function () {
  let RewardToken, rewardToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardTokenFactory.deploy(owner.address);
    await rewardToken.waitForDeployment();
  });

  it("Should deploy with correct name and symbol", async function () {
    expect(await rewardToken.name()).to.equal("Foodoi");
    expect(await rewardToken.symbol()).to.equal("FDO");
  });

  it("Should assign the total supply to the owner", async function () {
    const ownerBalance = await rewardToken.balanceOf(owner.address);
    expect(await rewardToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should allow owner to assign rewards", async function () {
    await rewardToken.assignReward(addr1.address, ethers.parseUnits("100", 18));
    expect(await rewardToken.checkReward(addr1.address)).to.equal(ethers.parseUnits("100", 18));
  });

  it("Should prevent non-owners from assigning rewards", async function () {
    await expect(rewardToken.connect(addr1).assignReward(addr2.address, 100))
      .to.be.revertedWithCustomError(rewardToken, "OwnableUnauthorizedAccount");
  });

  it("Should allow owner to transfer tokens via workingtransfer", async function () {
    await rewardToken.workingtransfer(addr1.address, ethers.parseUnits("50", 18));
    expect(await rewardToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("50", 18));
  });

  it("Should prevent non-owners from using workingtransfer", async function () {
    await expect(rewardToken.connect(addr1).workingtransfer(addr2.address, ethers.parseUnits("10", 18)))
      .to.be.revertedWithCustomError(rewardToken, "OwnableUnauthorizedAccount");
  });

  it("Should return correct pending rewards", async function () {
    await rewardToken.assignReward(addr1.address, ethers.parseUnits("200", 18));
    expect(await rewardToken.checkReward(addr1.address)).to.equal(ethers.parseUnits("200", 18));
  });
});
