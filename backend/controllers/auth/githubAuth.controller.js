const jwt = require("jsonwebtoken");

const githubAuthCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "GitHub authentication failed",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Redirect to frontend with token
    return res.redirect(`http://localhost:4200/login/success?token=${token}`);
  } catch (err) {
    console.error("GitHub callback error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during GitHub login",
    });
  }
};

module.exports = { githubAuthCallback };
