import { ISignal } from "../constants";

export default class Signal {
    public id: string;
    private type: string;
    private sdp: string;
    private key: string;

    constructor(signal: ISignal) {
        this.id = signal.id;
        this.sdp = signal.sdp;
        this.type = signal.type;
        this.key = signal.key;
    }

    public toUpdate() {
        const key = (this.type === 'offer')? '*****' : this.key;
        return `${key}${this.type}:${this.id}_${this.sdp}`;
    }
}
