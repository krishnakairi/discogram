import * as SimplePeer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import MessageService from './services/message.service';
import { IPeerConfig } from './constants';
import * as EventEmitter from 'eventemitter3';

export default class Peer {
    public peerId: string;
    public initiator: boolean;
    public peerInstance: SimplePeer.Instance;
    public messageServce: MessageService;
    public event: EventEmitter;
    public expiryInMins: number;

    constructor(config: IPeerConfig) {
        this.peerId = uuidv4();
        this.initiator = config.initiator;
        this.messageServce = MessageService.getInstance();
        this.event = new EventEmitter();
        this.expiryInMins = this.messageServce.expiresInMins;

        this.peerInstance = new SimplePeer({
            stream: config.stream  || false,
            initiator: this.initiator,
            trickle: false,
            wrtc: config.wrtc
        });

        this.event.emit('created', this);

        this.peerInstance.on('connect', () => {
            this.event.emit('connect', this.peerInstance);
        })
    }

    public async destroy(): Promise<void> {
        this.peerInstance.removeAllListeners()
        await this.firstEvent('close', () => this.peerInstance.destroy());
        this.event.emit('close');
    }

    public sendSignal(data, responseKey?: string): Promise<any> {
        if (responseKey) {
            return this.firstEvent(responseKey, () => this.peerInstance.signal(data))
        }
        return Promise.resolve(this.peerInstance.signal(data))
    }

    public firstEvent(key: string, cb = () => {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.peerInstance.once(key, (response) => {
                resolve(response)
            });
            this.peerInstance.once('error', (error) => {
                reject(error);
                this.event.emit('error', error);
            });
            cb();
        })
    }
}
