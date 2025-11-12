const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Auth provider info (dynamic)
    authProvider: {
      provider: {
        type: String,
        enum: ["email", "google", "github"],
        default: "email",
      },
      providerId: {
        type: String, // googleId / githubId / empty if email login
        default: "",
      },
    },

    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    password: {
      type: String,
      required: function () {
        return this.authProvider?.provider === "email";
      },
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
