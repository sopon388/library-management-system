require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/User");
const Book = require("./models/Book");

(async () => {
  await connectDB();

  const password = await bcrypt.hash("Admin@12345", 12);

  await User.updateOne(
    { email: "admin@library.local" },
    {
      $setOnInsert: {
        name: "System Administrator",
        email: "admin@library.local",
        password,
        role: "admin",
        status: "active",

        // NEW: Admin is already verified
        isEmailVerified: true,
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
    },
    { upsert: true }
  );

  if (await Book.countDocuments() === 0) {
    await Book.insertMany([
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        category: "Programming",
        publisher: "Prentice Hall",
        year: 2008,
        totalCopies: 5,
        availableCopies: 5,
        location: "A-01"
      },
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        isbn: "9780135957059",
        category: "Programming",
        publisher: "Addison-Wesley",
        year: 2019,
        totalCopies: 4,
        availableCopies: 4,
        location: "A-02"
      },
      {
        title: "Database System Concepts",
        author: "Abraham Silberschatz",
        isbn: "9780078022159",
        category: "Database",
        publisher: "McGraw-Hill",
        year: 2019,
        totalCopies: 3,
        availableCopies: 3,
        location: "B-01"
      }
    ]);
  }

  console.log(
    "Seed complete. Admin: admin@library.local / Admin@12345"
  );

  await mongoose.disconnect();
})();