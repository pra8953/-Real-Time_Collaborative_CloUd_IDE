const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
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
      lowercase: true,
      trim: true,
    },

    // Auth provider info (dynamic)
    authProvider: {
      type: {
        provider: {
          type: String,
          enum: ['email', 'google', 'github'],
          required: true,
          default: 'email'
        },
        providerId: {
          type: String, // googleId / githubId / empty if email login
          default: '',
        },
      },
      required: true,
    },

    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // reference to Project model
      },
    ],

    password: {
      type: String,
      required: function () {
        // password required only if provider = email
        return this.authProvider.provider === 'email';
      },
    },
  },
  {
    timestamps: true, 
  }
)

const userModel = mongoose.model("Users",userSchema);
module.exports = userModel;