import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}
const studentSchema = new Schema<IStudent>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
});
export const Student = mongoose.model<IStudent>("Student", studentSchema);
