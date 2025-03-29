const User = require("../models/User");
const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, sub: googleId } = ticket.getPayload();
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        email,
        name,
        googleId,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Create JWT token
    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token: authToken // Include token in response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google login failed", error: error.message });
  }
};

// Send OTP for Signup/Login
exports.sendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP temporarily
    const tempOTP = {
      email,
      otp,
      expires: Date.now() + 300000 // 5 minutes expiry
    };
    
    global.tempOTPs = global.tempOTPs || {};
    global.tempOTPs[email] = tempOTP;

    // Send email with OTP
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification OTP",
      text: `Your OTP for verification is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: "OTP sent to email",
      isNewUser: !(await User.findOne({ email }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP and Complete Signup/Login
exports.verifySignupOTP = async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    
    // Check temporary OTP storage
    const storedOTP = global.tempOTPs?.[email];
    
    if (!storedOTP || storedOTP.otp !== otp || storedOTP.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        name,
      });
      await user.save();
      isNewUser = true;
    }

    // Create JWT token
    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Clean up temporary OTP
    delete global.tempOTPs[email];

    res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? "Signup successful" : "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token: authToken // Include token in response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-googleId');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



exports.getInviteDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('invitedFriends totalBalance');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      invitedFriends: user.invitedFriends,
      totalBalance: user.totalBalance,
      inviteCode: `PERFECT11-${req.user.id.toString().slice(-6).toUpperCase()}`,
      rewardAmount: 100 // ₹100 reward per successful invite
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.sendInvite = async (req, res) => {
  try {
    const { email, name } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!email || !name) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if already invited
    const alreadyInvited = user.invitedFriends.some(friend => 
      friend.email === email
    );
    
    if (alreadyInvited) {
      return res.status(400).json({ message: "This email has already been invited" });
    }
    
    // Add to invited friends
    user.invitedFriends.push({
      name,
      email,
      reward: 0,
      status: 'pending'
    });
    
    await user.save();
    
    // Send email (simplified version)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const inviteCode = `PERFECT11-${userId.toString().slice(-6).toUpperCase()}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${user.name} has invited you to join Perfect11!`,
      html: `
        <h2>Join Perfect11 and get ₹100 bonus!</h2>
        <p>Your friend ${user.name} has invited you to join Perfect11, the best fantasy sports platform.</p>
        <p>Use this invite code when signing up: <strong>${inviteCode}</strong></p>
        <p>When your friend completes their first contest, you'll both get ₹100 bonus!</p>
        <a href="${process.env.FRONTEND_URL}/signup?invite=${inviteCode}">Join Now</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: "Invite sent successfully",
      inviteCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send invite", error: error.message });
  }
};

exports.processInviteAcceptance = async (inviteCode, newUserId) => {
  try {
    // Extract userId from invite code
    const userId = inviteCode.split('-')[1].toLowerCase();
    
    const referringUser = await User.findById(userId);
    if (!referringUser) return;
    
    // Find pending invite for this email
    const invitedFriend = referringUser.invitedFriends.find(
      friend => friend.status === 'pending'
    );
    
    if (invitedFriend) {
      // Update status to accepted
      invitedFriend.status = 'accepted';
      invitedFriend.reward = 100; // ₹100 reward
      
      // Add reward to referring user's balance
      referringUser.totalBalance += 100;
      
      // Add transaction record
      referringUser.transactionHistory.push({
        type: 'Invite Reward',
        rupees: 100,
        state: 'completed'
      });
      
      await referringUser.save();
      
      // Also add reward to new user (the referred user)
      const newUser = await User.findById(newUserId);
      if (newUser) {
        newUser.totalBalance += 100;
        newUser.transactionHistory.push({
          type: 'Referral Bonus',
          rupees: 100,
          state: 'completed'
        });
        await newUser.save();
      }
    }
  } catch (error) {
    console.error("Error processing invite acceptance:", error);
  }
};

exports.cashOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

  

    if (amount < 100) {
      return res.status(400).json({ 
        success: false,
        message: 'Minimum withdrawal amount is ₹100' 
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.totalBalance < amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient balance' 
      });
    }

    const transaction = {
      type: 'withdrawal',
      rupees: amount,
      state: 'pending' 
    };

    // Update user balance and add transaction
    user.totalBalance -= amount;
    user.transactionHistory.push(transaction);
    
    await user.save();

    // Here you would typically:
    // 1. Initiate bank transfer via payment gateway
    // 2. Update transaction status based on transfer result
    // 3. Maybe send email notification

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      newBalance: user.totalBalance,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Cashout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};