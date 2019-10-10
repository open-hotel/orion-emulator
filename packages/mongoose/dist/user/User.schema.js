"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserProfileSchema = new mongoose_1.Schema({
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
}, { _id: false });
exports.UserAccountSchema = new mongoose_1.Schema({
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
}, { _id: false });
exports.UserConfigSchema = new mongoose_1.Schema({
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
}, { _id: false });
exports.UserCreditschema = new mongoose_1.Schema({
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
exports.UserSchema = new mongoose_1.Schema({
    profile: {
        type: exports.UserProfileSchema,
        default: {},
    },
    account: {
        type: exports.UserAccountSchema,
        default: {},
    },
    config: {
        type: exports.UserConfigSchema,
        default: {},
    },
    credits: {
        type: exports.UserCreditschema,
        default: {},
    },
    auth_ticket: {
        type: String,
        unique: true,
    },
});
//# sourceMappingURL=User.schema.js.map