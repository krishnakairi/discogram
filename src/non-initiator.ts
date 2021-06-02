import { IPeerConfig } from "./constants";
import Peer from "./peer";

export default class NonInitiator extends Peer {
    public answer: string;

    constructor(config: IPeerConfig) {
        super(config);
    }

    async request(initiatorPeerId: string, key: string): Promise<void> {
        if (typeof key !== 'string' || key.length !== 5) {
            throw new Error('Invalid Key.');
        }
        const offer = await this.messageServce.getOffer(initiatorPeerId);
        const data = await this.sendSignal(offer, 'signal');
        this.answer = data.sdp;
        await this.messageServce.publish(initiatorPeerId, {
            ...data,
            key: key,
        });
    }
}
