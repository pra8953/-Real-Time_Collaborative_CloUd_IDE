const router = require("express").Router();
const passport = require("passport");
const {
  googleAuthCallback,
} = require("../controllers/auth/googleAuth.controller");

// Step 1: Redirect user to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback URL (defined in .env)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
  googleAuthCallback
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google authentication failed!",
  });
});

module.exports = router;
