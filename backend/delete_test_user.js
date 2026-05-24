const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/rejexiq")
  .then(async () => {
    console.log("Connected to MongoDB.");
    const res = await User.deleteMany({ fullName: "Test" });
    console.log("Deleted 'Test' users:", res.deletedCount);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
