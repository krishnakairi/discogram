import * as SimplePeer from 'simple-peer';
import * as EventEmitter from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import MessageService from './services/message.service';
import { IPeerConfig } from './constants';

export default class Peer extends EventEmitter {
    public peerId: string;
    public initiator: boolean;
    public peerInstance: SimplePeer.Instance;
    private announced: boolean;
    private messageServce: MessageService;

    constructor(config: IPeerConfig) {
        super();
        this.peerId = uuidv4();
        this.initiator = config.initiator;
        this.messageServce = MessageService.getInstance();

        this.peerInstance = new SimplePeer({
            stream: config.stream  || false,
            initiator: this.initiator,
            trickle: config.trickle || false,
        });

        if (!this.initiator) {
            this.announce(false);
        } else {
            this.sendSignal()
                .then(data => this.messageServce.publish(this.peerId, data))
                .then(() => this.announce(true))
        }
    }

    private announce(announced) {
        Promise.resolve().then(() => {
            if (!this.announced) {
                this.emit('announced', announced);
                this.announced = true;
            }
        })
    }

    public async request(peerId: string) {
        const offer = await this.messageServce.getOffer(peerId);
        const response = await this.sendSignal(offer);
        await this.messageServce.publish(this.peerId, { ...response, requestId: offer.requestId });
        return offer.requestId
    }

    public async accept(requestId: string) {
        const answer = await this.messageServce.getAnswer(requestId);
        this.sendSignal(answer);
    }

    private sendSignal(signal?): Promise<any> {
        return new Promise((resolve, reject) => {
            this.peerInstance.on('signal', async (response) => {
                resolve(response)
            });
            if (signal) {
                this.peerInstance.signal(signal);
            }
        })
    }
}
