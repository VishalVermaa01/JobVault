import API from "../api";

// Call backend to reward a user (from admin or engagement action)
export async function rewardUser(userAddress) {
  const res = await API.post("/reward", { userAddress });
  return res.data;
}
