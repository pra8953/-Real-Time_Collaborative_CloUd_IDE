const jwt = require("jsonwebtoken");

const googleAuthCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed",
      });
    }

    const token = jwt.sign(
      {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
      },
      process.env.JWT_SECRET,

      {
        expiresIn: "24h",
      }
    );

    return res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}`);
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during Google login",
    });
  }
};

module.exports = { googleAuthCallback };
