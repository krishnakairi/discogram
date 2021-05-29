import * as SimplePeer from 'simple-peer';
import * as EventEmitter from 'eventemitter3';
import { IPeerConfig } from './constants';
export default class Peer extends EventEmitter {
    peerId: string;
    initiator: boolean;
    peerInstance: SimplePeer.Instance;
    private announced;
    private messageServce;
    constructor(config: IPeerConfig);
    private announce;
    request(peerId: string): Promise<string>;
    accept(requestId: string): Promise<void>;
    private sendSignal;
}
