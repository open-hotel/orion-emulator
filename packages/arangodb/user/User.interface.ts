export declare type UserGender = 'M' | 'F';

export interface IUserConfig {
  daily_respect_points: number;
  daily_pet_respect_points: number;
  is_muted: boolean;
  block_new_friends: boolean;
  hide_online: boolean;
  block_follow: boolean;
  hide_inroom: boolean;
  client_volume: number;
  accept_trading: boolean;
  whisper_enabled: boolean;
  can_change_name: boolean;
}

export interface IUserCredits {
  credits: number;
  duckets: number;
  diamonds: number;
}

export interface IUserProfile {
  real_name: string;
  look: string;
  gender: UserGender;
  motto: string;
  respect: number;
}

export interface IUserAccount {
  username: string;
  password: string;
  email: string;
  rank: number;
  last_online: Date;
  last_login: Date;
  ip_last: string;
  ip_reg: string;
  mail_verified: boolean;
  vip: boolean;
  online: boolean;
}

export interface IUser extends Document {
  profile: IUserProfile;
  account: IUserAccount;
  config: IUserConfig;
  credits: IUserCredits;
  auth_ticket: string;
}