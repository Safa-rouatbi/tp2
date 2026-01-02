const Submission = require("../models/Submission");
const Review = require("../models/Review");
const { analyzeCodeWithAI } = require("../services/aiService");

exports.runAIReview = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission introuvable" });
    }

    const aiResult = await analyzeCodeWithAI(submission.code);

    let aiData;
    try {
      // Try to parse the response as JSON
      aiData = JSON.parse(aiResult.raw);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response (common with LLMs)
      const jsonMatch = aiResult.raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          aiData = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          // If still fails, use the raw response as a single comment
          aiData = { issues: [], bestPractices: [], suggestions: [], rawResponse: aiResult.raw };
        }
      } else {
        // Use the raw response as-is
        aiData = { issues: [], bestPractices: [], suggestions: [], rawResponse: aiResult.raw };
      }
    }

    const review = await Review.create({
      submissionId: submission._id,
      reviewerId: req.user.id,
      comments: [aiResult.raw],
      score: null,
      issues: aiData.issues || []
    });

    submission.status = "ANALYZED";
    await submission.save();

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur analyse IA" });
  }
};
