import {
  UserProfile,
  UserConfig,
  UserCredits,
  UserAccount,
} from '@open-hotel/common/dist/models/';
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  profile: UserProfile;
  account: UserAccount;
  config: UserConfig;
  credits: UserCredits;
  auth_ticket: string;
}

export const UserProfileSchema = new Schema<UserProfile>(
  {
    real_name: {
      type: String,
      default: ''
    },
    look: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      enum: ['M', 'F'],
      default: 'M'
    },
    motto: {
      type: String,
      default: ''
    },
    respect: {
      type: Number,
      default: 0
    },
  },
  { _id: false },
);

export const UserAccountSchema = new Schema<UserProfile>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      default: 0,
    },
    last_online: { type: Date },
    last_login: { type: Date },
    ip_last: { type: String },
    ip_reg: { type: String },
    mail_verified: {
      type: Boolean,
      default: false,
    },
    vip: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

export const UserConfigSchema = new Schema<UserProfile>(
  {
    daily_respect_points: {
      type: Number,
      default: 0,
    },
    daily_pet_respect_points: {
      type: Number,
      default: 0,
    },
    is_muted: {
      type: Boolean,
      default: false,
    },
    block_new_friends: {
      type: Boolean,
      default: false,
    },
    hide_online: {
      type: Boolean,
      default: false,
    },
    block_follow: {
      type: Boolean,
      default: false,
    },
    hide_inroom: {
      type: Number,
      default: false,
    },
    client_volume: {
      type: Number,
      default: 1,
      min: 0,
      max: 1,
    },
    accept_trading: {
      type: Boolean,
      default: true,
    },
    whisper_enabled: {
      type: Boolean,
      default: true,
    },
    can_change_name: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

export const UserCreditschema = new Schema<UserProfile>({
  credits: {
    type: Number,
    default: 0,
  },
  duckets: {
    type: Number,
    default: 0,
  },
  diamonds: {
    type: Number,
    default: 0,
  },
});

export const UserSchema = new Schema({
  profile: {
    type: UserProfileSchema,
    default: {},
  },
  account: {
    type: UserAccountSchema,
    default: {},
  },
  config: {
    type: UserConfigSchema,
    default: {},
  },
  credits: {
    type: UserCreditschema,
    default: {},
  },
  auth_ticket: {
    type: String,
    unique: true,
  },
});
