const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RewardTokenModule", (m) => {
  const deployer = m.getAccount(0); 
  
  const rewardToken = m.contract("RewardToken", [deployer]);

  return { rewardToken };
});
