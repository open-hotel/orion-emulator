import { createHmac } from 'crypto';
import uuid4 from 'uuid';
import WebSocket from 'ws';
import MsgPack from 'msgpack-js';

export class Packet {
  static from(data: WebSocket.Data) {
    const [uuid, event, payload, signature] = MsgPack.decode(data)
    return new Packet(event, payload, uuid, signature)
  }

  constructor(
    public event: string,
    public payload = null,
    public uuid: string = uuid4(),
    public signature?: string,
  ) {}

  sign(secret) {
    const { event, payload, uuid } = this;
    const data = JSON.stringify(`${uuid}:${event}:${payload}`);
    const signature = createHmac('sha256', secret)
      .update(data, 'utf8')
      .digest('base64');

    return new Packet(event, payload, uuid, signature);
  }

  validate(secret) {
    const { signature } = this.sign(secret);
    return signature === this.signature;
  }

  toBuffer() {
    const payload = [this.uuid, this.event, this.payload, this.signature];
    return MsgPack.encode(payload);
  }
}
