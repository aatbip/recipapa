import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  comparePassword: (password: string) => boolean;
  createAccessToken: () => string;
  createRefreshToken: () => string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.createAccessToken = function (): string {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
    }
  );
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign({ username: this.username }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });
};

const User = model<IUser>("User", userSchema);

export default User;
