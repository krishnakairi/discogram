import { ITelegramBotsInfo } from '../constants';
export declare class TelegramBotService {
    private senderBotClient;
    private receiverBotClient;
    private channelId;
    constructor({ chennelId, senderBotToken, receiverBotToken }: ITelegramBotsInfo);
    publishUpdate(messages: string): Promise<import("axios").AxiosResponse<any>>;
    getUpdates(): Promise<any>;
    deleteMessage(messageId: any): Promise<any>;
}
