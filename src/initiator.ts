import { IPeerConfig } from "./constants";
import Peer from "./peer";
import * as Chance from 'chance';

export default class Initiator extends Peer {
    public requestId: string;
    public offer: string;
    public announced: boolean;

    constructor(config: IPeerConfig) {
        super(config);
        this.requestId = this.getRequestId();
    }

    async announce() {
        const data = await this.signal('signal');
        this.offer = data.sdp;
        await this.messageServce.publish(this.peerId, { 
            ...data, 
            requestId: this.requestId,
            initiatorId: this.peerId,
        });
    }

    private getRequestId(): string {
        const chance = new Chance();
        return chance.string({ length: 5, casing: 'upper', alpha: true, numeric: true });
    }

    public async accept(requestId: string): Promise<void> {
        if (this.requestId !== requestId) {
            throw new Error('Invalid requestId.')
        }
        const answer = await this.messageServce.getAnswer(this.peerId, requestId);
        this.sendSignal(answer);
    }
}
