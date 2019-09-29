"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class WSClient {
    constructor(ws, request) {
        this.ws = ws;
        this.connectedAt = new Date();
        this.address = request.connection.remoteAddress;
    }
    setUsername(username) {
        this.username = username;
        return this;
    }
    generateSecret() {
        this.secret = crypto_1.randomBytes(16).toString('base64');
        return this;
    }
}
exports.WSClient = WSClient;
//# sourceMappingURL=WSClient.js.map