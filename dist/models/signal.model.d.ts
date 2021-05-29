import { ISignal } from "../constants";
export default class Signal {
    id: string;
    private type;
    private sdp;
    private requestId;
    private timeStamp;
    constructor(signal: ISignal);
    toUpdate(): string;
}
