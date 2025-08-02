// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RizeToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EngagementRewarder is Ownable {
    RizeToken public rizeToken;
    uint256 public rewardAmount;

    event UserRewarded(address indexed user, uint256 amount);

    constructor(address _rizeToken, uint256 _rewardAmount) Ownable(msg.sender) {
        rizeToken = RizeToken(_rizeToken);
        rewardAmount = _rewardAmount;
    }

    function setRewardAmount(uint256 _amount) external onlyOwner {
        rewardAmount = _amount;
    }

    function rewardUser(address user) external onlyOwner {
        require(user != address(0), "Invalid user address");
        rizeToken.mint(user, rewardAmount);
        emit UserRewarded(user, rewardAmount);
    }
}
