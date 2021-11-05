const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "upadatedAt",
        },
    }
);
const User = mongoose.model("user", userSchema);
module.exports = User;