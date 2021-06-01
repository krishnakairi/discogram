import { ISignal } from "../constants";

export default class Signal {
    public id: string;
    private type: string;
    private sdp: string;
    private requestId: string;
    private initiatorId: string;

    constructor(signal: ISignal) {
        this.id = signal.id;
        this.sdp = signal.sdp;
        this.type = signal.type;
        this.requestId = signal.requestId;
        this.initiatorId = signal.initiatorId;
    }

    public toUpdate() {
        const requestId = (this.type === 'offer')? '*****' : this.requestId;
        return `${this.id}:${this.type}:${this.initiatorId}:${requestId}_${this.sdp}`;
    }
}
