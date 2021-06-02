import { ISignal } from "../constants";

export default class Signal {
    public id: string;
    private type: string;
    private sdp: string;
    private key: string;
    private initiatorId: string;

    constructor(signal: ISignal) {
        this.id = signal.id;
        this.sdp = signal.sdp;
        this.type = signal.type;
        this.key = signal.key;
        this.initiatorId = signal.initiatorId;
    }

    public toUpdate() {
        const key = (this.type === 'offer')? '*****' : this.key;
        return `${this.id}:${this.type}:${this.initiatorId}:${key}_${this.sdp}`;
    }
}
