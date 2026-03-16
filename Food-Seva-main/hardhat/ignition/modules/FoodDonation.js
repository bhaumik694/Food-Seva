const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FoodDonationModule", (m) => {
    const foodDonation = m.contract("FoodDonation");

    return { foodDonation };
});
