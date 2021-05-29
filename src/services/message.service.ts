import { IDiscogramConfig, ISignal } from "../constants";
import Signal from '../models/signal.model';
import Updates from "../models/updates.model";
import { TelegramBotService } from "./telegram-bot.service";

export default class MessageService {
    private static instance: MessageService;
    private telegramBotService: TelegramBotService;

    public static getInstance(): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }

    init(config: IDiscogramConfig) {
        this.telegramBotService = new TelegramBotService({
            chennelId: config.channelId,
            senderBotToken: config.senderBotToken,
            receiverBotToken: config.receiverBotToken
        });
    }

    async publish(peerId, data) {
        const signal = new Signal({ ...data, id: peerId });
        await this.telegramBotService.publishUpdate(signal.toUpdate())
    }

    getSignals(): Promise<ISignal[]> {
        return this.telegramBotService.getUpdates().then((data) => {
            const updates = new Updates(data);
            return updates.toSignals();
        })
    }

    async getOffer(peerId: string) {
        const signals = await this.getSignals();
        const offer = signals.find(signal => signal.type === 'offer' && signal.id === peerId);
        if (!offer) {
            throw new Error(`No offer found for ${peerId}`);
        }
        return offer;
    }

    async getAnswer(requestId: string) {
        const signals = await this.getSignals();
        const answer = signals.find(signal => signal.type === 'answer' && signal.requestId === requestId);
        if (!answer) {
            throw new Error(`No answer found for ${requestId}`);
        }
        return answer;
    }
}
