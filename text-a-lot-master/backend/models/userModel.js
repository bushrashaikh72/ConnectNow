/*const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);

//instance method //available on all docs created out of certain collection
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
    //hashing it before we create(save)(pre-save) and storing it in db

});

const User = mongoose.model("User", userSchema);

module.exports = User;
*/const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Email validation regex (only declare once)
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: [emailPattern, 'Please enter a valid email address! It must contain "@" and a valid domain.'],
      
      // Additional custom validator (optional, since match is already validating)
      validate: {
        validator: function (v) {
          return emailPattern.test(v);
        },
        message: (props) => `${props.value} is not a valid email address! It must contain '@' and a valid domain.`,
      },
    },

    password: { type: String, required: true },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Instance method to match passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    return next(); // Skip hashing if the password hasn't been modified
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next(); // Call next() to continue to the next middleware
});

const User = mongoose.model("User", userSchema);

module.exports = User;
