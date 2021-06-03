import { IPeerConfig } from "./constants";
import Peer from "./peer";
import { delay } from "./utils";

export default class Initiator extends Peer {
    public offer: string;
    public expired: boolean;
    public announced: boolean;

    constructor(config: IPeerConfig) {
        super(config);
        this.expired = false;
    }

    public async announce(): Promise<void> {
        const data = await this.firstEvent('signal');
        this.offer = data.sdp;
        await this.messageServce.publish(this.peerId, data);
        this.announced = true;
        this.event.emit('announce', this);
        this.setTicker()
    }

    private setTicker(): void {
        delay(this.expiryInMins * 60 * 1000).then(() => {
            this.expired = true;
            this.offer = null;
            this.announced = false;
            this.event.emit('expiry', this);
        });
    }

    public async accept(key: string): Promise<void> {
        if (this.offer === null || !this.announced) {
            throw new Error('Offer not announced.');
        }

        if (this.expired) {
            throw new Error('Offer expied.');
        }
    
        if (typeof key !== 'string' || key.length !== 5) {
            throw new Error('Invalid Key.');
        }

        const answer = await this.messageServce.getAnswer(this.peerId, key);
        this.sendSignal(answer);
        this.event.emit('accept', this);
    }
}
