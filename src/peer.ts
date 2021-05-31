import * as SimplePeer from 'simple-peer';
import * as EventEmitter from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import * as Chance from 'chance';
import MessageService from './services/message.service';
import { IPeerConfig } from './constants';

export default class Peer extends EventEmitter {
    public peerId: string;
    public initiator: boolean;
    public requestId: number;
    public peerInstance: SimplePeer.Instance;
    private announced: boolean;
    private messageServce: MessageService;

    constructor(config: IPeerConfig) {
        super();
        const chance = new Chance();

        this.peerId = uuidv4();
        this.requestId = chance.integer();
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
            this.sendSignal('signal', false)
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

    public async request(peerId: string, requestId: number) {
        const offer = await this.messageServce.getOffer(peerId);
        const response = await this.sendSignal('signal', offer);
        const message = await this.messageServce.publish(this.peerId, { ...response, requestId });
    }

    public async accept(requestId: number) {
        const answer = await this.messageServce.getAnswer(requestId);
        const connected = await this.sendSignal('connect', answer);
    }

    private sendSignal(key, data): Promise<any> {
        return new Promise((resolve, reject) => {
            this.peerInstance.on(key, (response) => {
                resolve(response)
            });
            if (data) {
                this.peerInstance.signal(data);
            }
        })
    }
}
