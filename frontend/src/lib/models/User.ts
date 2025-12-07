// src/lib/models/User.ts
import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"] 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: [true, "Password is required"] 
    },
  },
  { 
    timestamps: true 
  }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;