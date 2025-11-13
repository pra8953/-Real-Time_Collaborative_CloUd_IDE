const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const userModel = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName: name, emails } = profile;
        const email = emails && emails.length ? emails[0].value : null;

        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        let user = await userModel.findOne({ email });

        if (!user) {
          const username =
            email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + Date.now();
          user = new userModel({
            username,
            name,
            email,
            authProvider: {
              provider: "google",
              providerId: googleId,
            },
            password: "",
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Google strategy error:", err);
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Ensure we have an email
        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          // Fetch user emails via GitHub API if not returned
          const response = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              "User-Agent": "Node.js",
            },
          });
          const emails = await response.json();

          // Find primary verified email
          const primaryEmail = emails.find((e) => e.primary && e.verified);
          email = primaryEmail ? primaryEmail.email : emails[0]?.email;
        }

        if (!email) {
          return done(new Error("No email found in GitHub profile"));
        }

        // Find or create user
        let user = await userModel.findOne({ email });

        if (!user) {
          const username =
            email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + Date.now();
          user = await userModel.create({
            username,
            name: profile.displayName || profile.username,
            email,
            authProvider: {
              provider: "github",
              providerId: profile.id,
            },
            password: "",
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("GitHub strategy error:", err);
        return done(err, null);
      }
    }
  )
);

// serialize & deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
