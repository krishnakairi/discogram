import axios, { AxiosInstance } from "axios";
import { ITelegramBotsInfo } from '../constants';
import Updates from "../models/updates.model";
import { promiseWhile } from "../utils";

export class TelegramBotService {
    private senderBotClient: AxiosInstance;
    private receiverBotClient: AxiosInstance;
    private channelId: number;
    private expiryInMins = 5;

    constructor({ chennelId, senderBotToken, receiverBotToken }: ITelegramBotsInfo) {
        this.channelId = chennelId;
        this.senderBotClient = axios.create({
            baseURL: `https://api.telegram.org/bot${senderBotToken}`
        });
        this.receiverBotClient = axios.create({
            baseURL: `https://api.telegram.org/bot${receiverBotToken}`
        });
    }

    publishUpdate(message: string) {
        return this.senderBotClient.post('sendMessage', {
            chat_id: this.channelId,
            text: message
        });
    }

    getUpdates(offset: number) {
        return this.receiverBotClient.post('getUpdates', {
            offset,
            allowed_updates: ['channel_post']
        }).then(({ data }) => {
            const prevOffset = offset;
            const { result } = data;
            const updates = new Updates(result);
            offset = updates.getOffset(this.expiryInMins);
            return { offset, result: updates, retry: (offset !== prevOffset) };
        });
    }

    async getLatestUpdates() {
        const { result } = await promiseWhile(
            (data) => this.getUpdates(data?.offset), 
            (data) => data?.retry
        );
        return result;
    }
}
