import { IDiscogramConfig, ISignal } from "../constants";
export default class MessageService {
    private static instance;
    private telegramBotService;
    static getInstance(): MessageService;
    init(config: IDiscogramConfig): void;
    publish(peerId: any, data: any): Promise<void>;
    getSignals(): Promise<ISignal[]>;
    getOffer(peerId: string): Promise<ISignal>;
    getAnswer(requestId: string): Promise<ISignal>;
}
