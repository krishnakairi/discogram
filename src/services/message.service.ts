import { IDiscogramConfig, ISignal } from "../constants";
import Signal from '../models/signal.model';
import { TelegramBotService } from "./telegram-bot.service";

const DEFAULT_EXPIRY_IN_MINS = 5;

export default class MessageService {
    private static instance: MessageService;
    private telegramBotService: TelegramBotService;
    public expiresInMins: number;

    public static getInstance(): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }

    init(config: IDiscogramConfig) {
        this.telegramBotService = new TelegramBotService({
            channelId: config.channelId,
            senderBotToken: config.senderBotToken,
            receiverBotToken: config.receiverBotToken,
            expiresInMins: config?.expiresInMins || DEFAULT_EXPIRY_IN_MINS
        });
        this.expiresInMins = config?.expiresInMins || DEFAULT_EXPIRY_IN_MINS;
    }

    async publish(peerId, data) {
        const signal = new Signal({ ...data, id: peerId });
        await this.telegramBotService.publishUpdate(signal.toUpdate())
    }

    getSignals(): Promise<ISignal[]> {
        return this.telegramBotService.getLatestUpdates()
            .then((updates) => {
                return updates.toSignals()
            })
    }

    async getOffer(peerId: string): Promise<ISignal> {
        const signals = await this.getSignals();
        const offer = signals.find(signal => signal.type === 'offer' && signal.id === peerId);
        if (!offer) {
            throw new Error(`No offer found for ${peerId}`);
        }
        return offer;
    }

    async getAnswer(initiatorId: string, key: string) {
        const signals = await this.getSignals();
        const answer = signals.find(signal => (
            signal.type === 'answer' &&
            signal.id === initiatorId &&
            signal.key === key
        ));
        if (!answer) {
            throw new Error(`No answer found for ${key}`);
        }
        return answer;
    }
}
