// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    mapping(address => uint256) public pendingRewards;

    constructor(address initialOwner) ERC20("Foodoi", "FDO") Ownable(initialOwner) {
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }
    function assignReward(address user, uint256 amount) external onlyOwner {
        pendingRewards[user] += amount;
    }
    function workingtransfer(address to, uint256 amount) external onlyOwner {
        _transfer(owner(), to, amount);
    }

    function checkReward(address user) external view returns (uint256) {
        return pendingRewards[user];
    }
}
