require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "0xkey";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // It's good practice to have a `hardhat` network configuration
    // for local testing and running a local node.
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      // Ensure the private key is only added if it exists
      accounts: SEPOLIA_PRIVATE_KEY !== "0xkey" ? [SEPOLIA_PRIVATE_KEY] : [],
    },
  },
};
