const express = require("express");
const router = express.Router();
const { runAIReview } = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/ai/:submissionId", protect, runAIReview);

module.exports = router;
