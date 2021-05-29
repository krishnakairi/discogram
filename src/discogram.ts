import * as EventEmitter from 'eventemitter3';
import Peer from './peer';
import MessageService from './services/message.service';
import { IDiscogramConfig, IPeerConfig } from './constants';

export class Discogram extends EventEmitter {
    public peers: Peer[]
    private messageServce: MessageService;

    constructor(config: IDiscogramConfig) {
        super();
        this.peers = [];
        this.messageServce = MessageService.getInstance();
        this.messageServce.init(config);
    }

    public getPeers(): Peer[] {
        return this.peers;
    }

    public createPeer(peerConfig: IPeerConfig): Promise<Peer> {
        return new Promise((resolve, reject) => {
            const peer = new Peer(peerConfig);
            peer.on('announced', () => {
                this.peers.push(peer);
                resolve(peer);
            })
        });
    }
}
