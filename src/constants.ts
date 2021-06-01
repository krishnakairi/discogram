export interface IDiscogramConfig {
    channelId: number;
    senderBotToken: string;
    receiverBotToken: string;
}

export interface IPeerConfig {
    stream?: any;
    initiator: boolean;
    wrtc?: any;
}

export interface ITelegramBotsInfo {
    chennelId: number;
    senderBotToken: string;
    receiverBotToken: string;
}

export interface ISignal {
    id: string;
    type: string;
    initiatorId: string;
    sdp: string;
    requestId: string;
}
