/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import { forbidden, notFound } from '../../utils/errorfunc';
import { Profile, User } from '../Auth/auth.model';
import { TChangePassword } from './user.interface';
import { hashedPassword } from '../../utils/hashedPassword';

// Get user profile
const getUserProfile = async (email: string) => {
  const user = await User.findOne({ email }).select('-password');
  
  if (!user) {
    throw notFound('User not found!');
  }

  const profile = await Profile.findOne({ email });


  if (!profile) {
    throw notFound('Profile not found!aaa');
  }

  return {
    user: {
      email: user.email,
      role: user.role,
      status: user.status,
      verified: user.verification?.verification,
    },
    profile: {
      businessName: profile.businessName,
      phone: profile.phone,
      email: profile.email,
      image: profile.image,
    },
  };
};

// Update user profile
const updateUserProfile = async (email: string, payload: any) => {
  const profile = await Profile.findOne({ email });

  
  if (!profile) {
    throw notFound('Profile not found!');
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { email },
    payload,
    { new: true },
  );

  return {
    message: 'Profile updated successfully',
    profile: updatedProfile,
  };
};

// Change password
const changePassword = async (email: string, payload: TChangePassword) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw notFound('User not found!');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw forbidden('Old password is incorrect');
  }

  const hashedPass = await hashedPassword(payload.newPassword);

  await User.findOneAndUpdate({ email }, { password: hashedPass });

  return {
    message: 'Password changed successfully',
  };
};

export const UserServices = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
