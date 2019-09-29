"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WSUser {
    constructor() {
        this.channels = {};
    }
    enterChannel(channel) {
        if (this.channels[channel.id])
            this.leaveChannel(channel);
        this.channels[channel.id] = channel;
        channel.add(this);
        return this;
    }
    leaveChannel(channel) {
        if (typeof channel === 'string') {
            channel = this.channels[channel];
        }
        if (channel) {
            channel.remove(this);
            delete this.channels[channel.id];
        }
        return this;
    }
    disconnect() {
        for (let channel in this.channels) {
            this.leaveChannel(this.channels[channel]);
        }
        this.socket.terminate();
    }
    send(packet) {
        return new Promise((resolve, reject) => {
            this.socket.send(packet.sign(this.secret).serialize(), (err) => err ? reject(err) : resolve());
        });
    }
}
exports.WSUser = WSUser;
//# sourceMappingURL=WSUser.js.map