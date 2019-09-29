"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const uuid_1 = __importDefault(require("uuid"));
const what_the_pack_1 = __importDefault(require("what-the-pack"));
const { encode, decode } = what_the_pack_1.default.initialize(2 ** 22);
class Packet {
    constructor(event, payload = null, uuid = uuid_1.default(), signature) {
        this.event = event;
        this.payload = payload;
        this.uuid = uuid;
        this.signature = signature;
    }
    static from(data) {
        const p = decode(data);
        console.log(p);
        return new Packet('VOID');
    }
    sign(secret) {
        const { event, payload, uuid } = this;
        const data = JSON.stringify(`${uuid}:${event}:${payload}`);
        const signature = crypto_1.createHmac('sha256', secret)
            .update(data, 'utf8')
            .digest('base64');
        return new Packet(event, payload, uuid, signature);
    }
    validate(secret) {
        const { signature } = this.sign(secret);
        return signature === this.signature;
    }
    serialize() {
        const payload = [this.uuid, this.event, this.payload, this.signature];
        return encode(payload);
    }
}
exports.Packet = Packet;
//# sourceMappingURL=Packet.js.map