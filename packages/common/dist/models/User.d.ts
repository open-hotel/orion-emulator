export declare type UserGender = 'M' | 'F';
export interface UserConfig {
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
export interface UserCredits {
    credits: number;
    belcredits: number;
    seasonal_credits: number;
}
export interface UserProfile {
    uuid: string;
    username: string;
    real_name: string;
    password: string;
    email: string;
    rank: number;
    look: string;
    gender: UserGender;
    motto: string;
    last_online: Date;
    last_login: Date;
    created_at: Date;
    online: boolean;
    ip_last: string;
    ip_reg: string;
    respect: number;
    mail_verified: boolean;
    vip: boolean;
    auth_ticket: string;
}
export interface User extends UserProfile, UserProfile, UserConfig {
}
