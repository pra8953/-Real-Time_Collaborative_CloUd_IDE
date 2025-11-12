// routes/githubAuth.routes.js
const router = require("express").Router();
const passport = require("passport");
const {
  githubAuthCallback,
} = require("../controllers/auth/githubAuth.controller");

// Step 1: Redirect user to GitHub for authentication
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Step 2: GitHub callback URL (defined in .env)
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/github/failure" }),
  githubAuthCallback
);

router.get("/github/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "GitHub authentication failed!",
  });
});

module.exports = router;
