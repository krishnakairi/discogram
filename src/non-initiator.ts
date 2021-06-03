import { IPeerConfig, ISignal } from "./constants";
import Peer from "./peer";
import * as unixTime from 'unix-time';
import { delay } from "./utils";

export default class NonInitiator extends Peer {
    public answer: string;
    public expired: boolean;

    constructor(config: IPeerConfig) {
        super(config);
        this.expired = false;
    }

    public async getSingal(initiatorPeerId: string) {
        const offer = await this.messageServce.getOffer(initiatorPeerId);
        const now = unixTime(new Date());
        const expiresInMs = now - offer.timeStamp;
        if (expiresInMs > (this.expiryInMins * 60 * 1000)) {
            this.expired = true;
            this.answer = null;
            this.event.emit('expiry', this);
            throw new Error('Signal got expired.');
        }
        this.setTicker(expiresInMs)
        return { signal: offer, expiresInMs };
    }

    private setTicker(expiryInMs): void {
        delay(expiryInMs).then(() => {
            this.expired = true;
            this.answer = null;
            this.event.emit('expiry', this);
        });
    }

    public async request(singal: ISignal, key: string): Promise<void> {
        if (this.expired) {
            throw new Error('Signal got expied.');
        }

        if (typeof key !== 'string' || key.length !== 5) {
            throw new Error('Invalid Key.');
        }

        const data = await this.sendSignal(singal, 'signal');
        this.answer = data.sdp;
        await this.messageServce.publish(singal.id, {
            ...data,
            key: key,
        });
        this.event.emit('request', this);
    }
}
