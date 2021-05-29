import * as EventEmitter from 'eventemitter3';
import Peer from './peer';
import { IDiscogramConfig, IPeerConfig } from './constants';
export declare class Discogram extends EventEmitter {
    peers: Peer[];
    private messageServce;
    constructor(config: IDiscogramConfig);
    getPeers(): Peer[];
    createPeer(peerConfig: IPeerConfig): Promise<Peer>;
}
