import { ethers } from "ethers";
import { RIZE_TOKEN_ADDRESS } from "./contractAddresses";
import { RIZE_TOKEN_ABI } from "./abis";

// Get RIZE token balance for a user
export async function getRizeTokenBalance(userAddress) {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(RIZE_TOKEN_ADDRESS, RIZE_TOKEN_ABI, provider);
  const balance = await contract.balanceOf(userAddress);
  return ethers.formatUnits(balance, 18);
}
