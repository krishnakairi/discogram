import MessageService from './services/message.service';
import { IDiscogramConfig, IPeerConfig } from './constants';
import Initiator from './initiator';
import NonInitiator from './non-initiator';

export class Discogram {
    public peers: Array<Initiator | NonInitiator>;
    private messageServce: MessageService;

    constructor(config: IDiscogramConfig) {
        this.peers = [];
        this.messageServce = MessageService.getInstance();
        this.messageServce.init(config);
    }

    getPeers(): Array<Initiator | NonInitiator> {
        return this.peers;
    }

    async createPeer(peerConfig: IPeerConfig): Promise<Initiator | NonInitiator> {
        const isInitiator = peerConfig.initiator;
        const peer = (isInitiator)? new Initiator(peerConfig) : new NonInitiator(peerConfig);
        if (peer instanceof Initiator) {
            const announced = await peer.announce();
        }
        this.peers.push(peer);
        return peer;
    }
}
