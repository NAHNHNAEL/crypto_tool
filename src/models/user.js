import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true
  },
  password: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  role: {
      type: String,
      enum: ['admin', 'collaborator', 'user'], // Các vai trò có thể có
      default: 'user'
  },
  isVerified: {
      type: Boolean,
      default: false
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

// Middleware mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  const user = this;

  // Chỉ mã hóa mật khẩu nếu mật khẩu được thay đổi hoặc là mật khẩu mới
  if (!user.isModified('password')) return next();

  try {
    // Tạo một salt với độ dài 10
    const salt = await bcrypt.genSalt(10);
    // Mã hóa mật khẩu của người dùng với salt
    const hash = await bcrypt.hash(user.password, salt);
    // Thay thế mật khẩu gốc bằng mật khẩu đã mã hóa
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;