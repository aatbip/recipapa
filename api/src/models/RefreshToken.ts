import { Schema, model, Types } from "mongoose";

export interface IRefreshToken {
  _id: Types.ObjectId;
  refreshToken: string;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  refreshToken: {
    type: String,
    required: true,
    default: ""
  },
});

const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export { RefreshToken };
