import { IPeerConfig } from "./constants";
import Peer from "./peer";
import * as Chance from 'chance';

export default class Initiator extends Peer {
    public key: string;
    public offer: string;
    public announced: boolean;

    constructor(config: IPeerConfig) {
        super(config);
        this.key = this.getRandomKey();
    }

    async announce() {
        const data = await this.signal('signal');
        this.offer = data.sdp;
        await this.messageServce.publish(this.peerId, { 
            ...data, 
            key: this.key,
            initiatorId: this.peerId,
        });
    }

    private getRandomKey(): string {
        const chance = new Chance();
        return chance.string({ length: 5, casing: 'upper', alpha: true, numeric: true });
    }

    public async accept(key: string): Promise<void> {
        const answer = await this.messageServce.getAnswer(this.peerId, key);
        this.sendSignal(answer);
    }
}
