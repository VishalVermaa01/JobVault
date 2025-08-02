const express = require("express");
const router = express.Router();
const { rewarder } = require("../utils/contracts");

// POST /api/reward
// { userAddress: "0x..." }
router.post("/", async (req, res) => {
  const { userAddress } = req.body;
  if (!userAddress) return res.status(400).json({ error: "userAddress required" });
  try {
    const tx = await rewarder.rewardUser(userAddress);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
