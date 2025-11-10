const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {
      type: String,
      unique: true,
      trim: true,
      default: function () {
        return this.email.split('@')[0] + Date.now(); 
      }
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
      type: {
        provider: {
          type: String,
          enum: ['email', 'google', 'github'],
        
          default: 'email'
        },
        providerId: {
          type: String, // googleId / githubId / empty if email login
          default: '',
        },
      },
    
    },

    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],

    password: {
      type: String,
      required:true
    },
  },
  {
    timestamps: true, 
  }
)

const userModel = mongoose.model("Users",userSchema);
module.exports = userModel;