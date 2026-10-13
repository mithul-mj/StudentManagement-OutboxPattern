import mongoose, { Document, Mongoose, Schema } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
}
const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      requried: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);
export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
