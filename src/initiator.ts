import { IPeerConfig } from "./constants";
import Peer from "./peer";

export default class Initiator extends Peer {
    public offer: string;
    public announced: boolean;

    constructor(config: IPeerConfig) {
        super(config);
    }

    async announce() {
        const data = await this.firstEvent('signal');
        this.offer = data.sdp;
        await this.messageServce.publish(this.peerId, data);
    }

    public async accept(key: string): Promise<void> {
        if (typeof key !== 'string' || key.length !== 5) {
            throw new Error('Invalid Key.');
        }
        const answer = await this.messageServce.getAnswer(this.peerId, key);
        this.sendSignal(answer);
    }
}
