// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FoodDonation {
    address public owner; // Added owner variable

    struct Donation {
        address donor;
        string foodDetails;
        uint256 quantity;
        string location;
        uint256 timestamp;
        bool claimed;
    }

    Donation[] public donations;
    mapping(uint256 => bool) public claimedDonations;

    event FoodDonated(address indexed donor, string foodDetails, uint256 quantity, string location, uint256 timestamp);
    event FoodClaimed(uint256 indexed donationId, address indexed recipient);

    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    function donateFood(string memory foodDetails, uint256 quantity, string memory location) public {
        donations.push(Donation(msg.sender, foodDetails, quantity, location, block.timestamp, false));
        emit FoodDonated(msg.sender, foodDetails, quantity, location, block.timestamp);
    }

    function claimFood(uint256 donationId) public {
        require(donationId < donations.length, "Invalid donation ID");
        require(!donations[donationId].claimed, "Already claimed");

        donations[donationId].claimed = true;
        claimedDonations[donationId] = true;
        emit FoodClaimed(donationId, msg.sender);
    }

    function getDonationsCount() public view returns (uint256) {
        return donations.length;
    }

    function getDonation(uint256 index) public view returns (address, string memory, uint256, string memory, uint256, bool) {
        require(index < donations.length, "Index out of bounds");
        Donation memory d = donations[index];
        return (d.donor, d.foodDetails, d.quantity, d.location, d.timestamp, d.claimed);
    }
     function getAllDonations() public view returns (
        address[] memory, 
        string[] memory, 
        uint256[] memory, 
        string[] memory, 
        uint256[] memory, 
        bool[] memory
    ) {
        uint256 length = donations.length;
        address[] memory donors = new address[](length);
        string[] memory foodDetails = new string[](length);
        uint256[] memory quantities = new uint256[](length);
        string[] memory locations = new string[](length);
        uint256[] memory timestamps = new uint256[](length);
        bool[] memory claimedStatuses = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            Donation memory d = donations[i];
            donors[i] = d.donor;
            foodDetails[i] = d.foodDetails;
            quantities[i] = d.quantity;
            locations[i] = d.location;
            timestamps[i] = d.timestamp;
            claimedStatuses[i] = d.claimed;
        }

        return (donors, foodDetails, quantities, locations, timestamps, claimedStatuses);
    }
}
