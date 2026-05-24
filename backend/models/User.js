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
    tags:      { type: [String], default: [] },
    bio:       { type: String, default: "" },
    status:    { type: String, enum: ["online", "offline"], default: "offline" },
    lastSeen:  { type: Date, default: Date.now },
    points:    { type: Number, default: 0 },
    rank:      { type: Number, default: 0 },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" }
    },
    privacy: { type: String, enum: ["public", "private"], default: "public" },
    assessmentDone: { type: Boolean, default: false },
    onboarded: { type: Boolean, default: false },
    school: { type: String, default: "" },
    branch: { type: String, default: "" },
    track: { type: String, default: "" },
    trackSelected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before save (only for local accounts)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
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
    username:       this.username,
    email:          this.email,
    avatar:         this.avatar,
    provider:       this.provider,
    role:           this.role,
    skills:         this.skills,
    tags:           this.tags,
    bio:            this.bio,
    status:         this.status,
    lastSeen:       this.lastSeen,
    points:         this.points,
    rank:           this.rank,
    socialLinks:    this.socialLinks,
    privacy:        this.privacy,
    assessmentDone: this.assessmentDone,
    onboarded:      this.onboarded,
    school:         this.school,
    branch:         this.branch,
    track:          this.track,
    trackSelected:  this.trackSelected,
    isNewUser:      this.isNewUser || false,
    createdAt:      this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
