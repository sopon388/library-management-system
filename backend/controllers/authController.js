const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


function token(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}


// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must contain at least 6 characters"
    });
  }

  const exists = await User.findOne({
    email: email.toLowerCase()
  });

  if (exists) {
    return res.status(409).json({
      message: "Email already registered"
    });
  }

  // Generate 6 digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Code will expire after 10 minutes
  const verificationExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 12),
    phone,
    address,
    role: "member",

    // NEW: email verification
    isEmailVerified: false,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: verificationExpires
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Your LibraCore Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          <h2 style="color: #333;">Welcome to LibraCore Library 📚</h2>

          <p>Hello <strong>${user.name}</strong>,</p>

          <p>
            Thank you for registering with LibraCore Library.
            Please use the verification code below to verify your email address.
          </p>

          <div style="
            background: #f4f4f4;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
            border-radius: 8px;
          ">
            <h1 style="letter-spacing: 8px; margin: 0;">
              ${verificationCode}
            </h1>
          </div>

          <p>
            This verification code will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not create this account, you can safely ignore this email.
          </p>

          <br>

          <p>
            Regards,<br>
            <strong>LibraCore Library</strong>
          </p>
        </div>
      `
    });

    // Don't send JWT before email verification
    res.status(201).json({
      message: "Registration successful. Verification code sent to your email.",
      email: user.email,
      requiresVerification: true
    });

  } catch (error) {
    // If email cannot be sent, remove the newly created account
    await User.findByIdAndDelete(user._id);

    console.error("Email sending error:", error);

    return res.status(500).json({
      message: "Registration failed because verification email could not be sent"
    });
  }
};


// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified"
      });
    }

    if (!user.emailVerificationCode) {
      return res.status(400).json({
        message: "No verification code found"
      });
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Verification code has expired"
      });
    }

    if (user.emailVerificationCode !== String(code)) {
      return res.status(400).json({
        message: "Invalid verification code"
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.json({
      message: "Email verified successfully",
      token: token(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      message: "Email verification failed"
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: String(email || "").toLowerCase()
  });

  if (
    !user ||
    !(await bcrypt.compare(password || "", user.password))
  ) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  // NEW: Require email verification
  if (!user.isEmailVerified) {
    return res.status(403).json({
      message: "Please verify your email before logging in"
    });
  }

  if (user.status !== "active") {
    return res.status(403).json({
      message: "Account is suspended"
    });
  }

  res.json({
    token: token(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};


// ME
exports.me = async (req, res) => res.json(req.user);