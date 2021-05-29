import { ISignal } from "../constants";
import * as Chance from 'chance';

export default class Signal {
    public id: string;
    private type: string;
    private sdp: string;
    private requestId: string;
    private timeStamp: number;

    constructor(signal: ISignal) {
        const chance = new Chance();
        this.id = signal.id;
        this.sdp = signal.sdp;
        this.type = signal.type;
        this.timeStamp = new Date().getTime();
        this.requestId = (this.type === 'offer')?  chance.string({ length: 5, pool: '0123456789' }): signal.requestId;
    }

    public toUpdate() {
        return `${this.id}:${this.timeStamp}:${this.type}:${this.requestId}_${this.sdp}`;
    }
}
