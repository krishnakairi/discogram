import axios, { AxiosInstance } from "axios";
import { ITelegramBotsInfo } from '../constants';

export class TelegramBotService {
    private senderBotClient: AxiosInstance;
    private receiverBotClient: AxiosInstance;
    private channelId: number;

    constructor({ chennelId, senderBotToken, receiverBotToken }: ITelegramBotsInfo) {
        this.channelId = chennelId;
        this.senderBotClient = axios.create({
            baseURL: `https://api.telegram.org/bot${senderBotToken}`
        });
        this.receiverBotClient = axios.create({
            baseURL: `https://api.telegram.org/bot${receiverBotToken}`
        });
    }

    publishUpdate(messages: string) {
        return this.senderBotClient.post('sendMessage', {
            chat_id: this.channelId,
            text: messages
        });
    }

    getUpdates() {
        return this.receiverBotClient.get('getUpdates?offset=868574634').then(({ data }) => {
            const { result } = data;
            return result;
        });
    }

    deleteMessage(messageId) {
        return this.receiverBotClient.post('deleteMessage', {
            chat_id: this.channelId,
            message_id: messageId
        }).then(({ data }) => {
            const { result } = data;
            return result;
        });
    }
}
