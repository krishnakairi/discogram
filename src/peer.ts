import * as SimplePeer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import MessageService from './services/message.service';
import { IPeerConfig } from './constants';

export default class Peer {
    public peerId: string;
    public initiator: boolean;
    public peerInstance: SimplePeer.Instance;
    public messageServce: MessageService;

    constructor(config: IPeerConfig) {
        this.peerId = uuidv4();
        this.initiator = config.initiator;
        this.messageServce = MessageService.getInstance();
        this.peerInstance = new SimplePeer({
            stream: config.stream  || false,
            initiator: this.initiator,
            trickle: false,
            wrtc: config.wrtc
        });
    }

    destroy() {
        this.peerInstance.removeAllListeners()
        return this.signal('close', () => {
            this.peerInstance.destroy();
        })
    }

    sendSignal(data, responseKey?: string): Promise<any> {
        if (responseKey) {
            return this.signal(responseKey, () => {
                this.peerInstance.signal(data);
            })
        } else {
            this.peerInstance.signal(data);
            return Promise.resolve()
        }
    }

    signal(key: string, cb = () => {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.peerInstance.once(key, (response) => {
                resolve(response)
            });
            this.peerInstance.once('error', (error) => {
                reject(error);
            });
            cb();
        })
    }
}
