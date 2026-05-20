const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName:  { type: String, required: true, trim: true },
    username:  { type: String, trim: true, lowercase: true, sparse: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, select: false },   // not returned by default
    avatar:    { type: String, default: "" },
    provider:  { type: String, enum: ["local", "google"], default: "local" },
    googleUid: { type: String, sparse: true },
    role:      { type: String, enum: ["user", "admin"], default: "user" },
    skills:    { type: Object, default: {} },
    assessmentDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before save (only for local accounts)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Safe public object (no password)
userSchema.methods.toPublic = function () {
  return {
    id:             this._id.toString(),
    name:           this.fullName,
    email:          this.email,
    avatar:         this.avatar,
    provider:       this.provider,
    role:           this.role,
    skills:         this.skills,
    assessmentDone: this.assessmentDone,
    createdAt:      this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
