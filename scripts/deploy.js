const { ethers } = require("hardhat");

async function main() {
  // Deploy RizeToken with initial supply (e.g., 1 million tokens)
  const initialSupply = ethers.parseUnits("1000000", 18);
  const RizeToken = await ethers.getContractFactory("RizeToken");
  const rizeToken = await RizeToken.deploy(initialSupply);
  await rizeToken.waitForDeployment();
  console.log("RizeToken deployed to:", await rizeToken.getAddress());

  // Deploy EngagementRewarder with RizeToken address and reward amount (e.g., 100 tokens)
  const rewardAmount = ethers.parseUnits("100", 18);
  const EngagementRewarder = await ethers.getContractFactory("EngagementRewarder");
  const rewarder = await EngagementRewarder.deploy(await rizeToken.getAddress(), rewardAmount);
  await rewarder.waitForDeployment();
  console.log("EngagementRewarder deployed to:", await rewarder.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
