export default class Offer {
    private offer;
    private msgSize;
    private timeStamp;
    constructor(offer: any, msgSize?: number);
    toUpdates(): string[];
    private getMessages;
    private getChunks;
}
