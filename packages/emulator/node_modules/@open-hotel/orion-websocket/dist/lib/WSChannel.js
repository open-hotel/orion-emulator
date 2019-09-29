"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WSUser_1 = require("./WSUser");
class WSChannel {
    constructor(id) {
        this.id = id;
    }
    add(user) {
        this.users[user.username] = user;
        return this;
    }
    remove(user) {
        if (user instanceof WSUser_1.WSUser)
            user = user.username;
        delete this.users[user];
        return this;
    }
    async send(packet) {
        for (let u in this.users) {
            const user = this.users[u];
            return user.send(packet);
        }
    }
}
exports.WSChannel = WSChannel;
//# sourceMappingURL=WSChannel.js.map