// Utility to interact with deployed contracts on Sepolia
const { ethers } = require("ethers");
const RizeToken = require("../../artifacts/contracts/RizeToken.sol/RizeToken.json");
const EngagementRewarder = require("../../artifacts/contracts/EngagementRewarder.sol/EngagementRewarder.json");
require("dotenv").config();


if (!process.env.SEPOLIA_PRIVATE_KEY) {
  console.error("SEPOLIA_PRIVATE_KEY is undefined! Check your .env and dotenv config.");
} else {
  console.log("PRIVATE KEY LENGTH:", process.env.SEPOLIA_PRIVATE_KEY.length);
}
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);


// TODO: Replace with your actual deployed addresses
const RIZE_TOKEN_ADDRESS = process.env.RIZE_TOKEN_ADDRESS;
const REWARDER_ADDRESS = process.env.REWARDER_ADDRESS;

const rizeToken = new ethers.Contract(RIZE_TOKEN_ADDRESS, RizeToken.abi, wallet);
const rewarder = new ethers.Contract(REWARDER_ADDRESS, EngagementRewarder.abi, wallet);

module.exports = { rizeToken, rewarder };
