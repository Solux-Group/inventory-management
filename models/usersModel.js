const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    foto: {
      type: String,
      required: true,
      default: "user.jpg",
    },
    nama: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    no_telp: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("users", usersSchema);
