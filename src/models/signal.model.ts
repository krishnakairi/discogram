import { ISignal } from "../constants";

export default class Signal {
    public id: string;
    private type: string;
    private sdp: string;
    private requestId: number;
    private timeStamp: number;

    constructor(signal: ISignal) {
        this.id = signal.id;
        this.sdp = signal.sdp;
        this.type = signal.type;
        this.requestId = signal.requestId || 0;
    }

    public toUpdate() {
        return `${this.id}:${this.type}:${this.requestId}_${this.sdp}`;
    }
}
