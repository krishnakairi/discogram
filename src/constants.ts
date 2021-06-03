export interface IDiscogramConfig {
    channelId: number;
    senderBotToken: string;
    receiverBotToken: string;
    expiresInMins?: number;
}

export interface IPeerConfig {
    stream?: any;
    initiator: boolean;
    wrtc?: any;
}

export interface ITelegramBotsInfo {
    channelId: number;
    senderBotToken: string;
    receiverBotToken: string;
    expiresInMins: number;
}

export interface ISignal {
    id: string;
    type: string;
    sdp: string;
    key: string;
    timeStamp: number;
}
