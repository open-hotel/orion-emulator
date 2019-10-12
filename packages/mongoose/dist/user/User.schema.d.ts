import { UserProfile, UserConfig, UserCredits, UserAccount } from '@open-hotel/common/dist/models/';
import { Schema, Document } from 'mongoose';
export interface IUser extends Document {
    profile: UserProfile;
    account: UserAccount;
    config: UserConfig;
    credits: UserCredits;
    auth_ticket: string;
}
export declare const UserProfileSchema: Schema<UserProfile>;
export declare const UserAccountSchema: Schema<UserProfile>;
export declare const UserConfigSchema: Schema<UserProfile>;
export declare const UserCreditschema: Schema<UserProfile>;
export declare const UserSchema: Schema<any>;
