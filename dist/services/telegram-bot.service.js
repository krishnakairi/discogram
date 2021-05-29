"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotService = void 0;
var axios_1 = require("axios");
var TelegramBotService = /** @class */ (function () {
    function TelegramBotService(_a) {
        var chennelId = _a.chennelId, senderBotToken = _a.senderBotToken, receiverBotToken = _a.receiverBotToken;
        this.channelId = chennelId;
        this.senderBotClient = axios_1.default.create({
            baseURL: "https://api.telegram.org/bot" + senderBotToken
        });
        this.receiverBotClient = axios_1.default.create({
            baseURL: "https://api.telegram.org/bot" + receiverBotToken
        });
    }
    TelegramBotService.prototype.publishUpdate = function (messages) {
        return this.senderBotClient.post('sendMessage', {
            chat_id: this.channelId,
            text: messages
        });
    };
    TelegramBotService.prototype.getUpdates = function () {
        return this.receiverBotClient.get('getUpdates?offset=868574634').then(function (_a) {
            var data = _a.data;
            var result = data.result;
            return result;
        });
    };
    TelegramBotService.prototype.deleteMessage = function (messageId) {
        return this.receiverBotClient.post('deleteMessage', {
            chat_id: this.channelId,
            message_id: messageId
        }).then(function (_a) {
            var data = _a.data;
            var result = data.result;
            return result;
        });
    };
    return TelegramBotService;
}());
exports.TelegramBotService = TelegramBotService;
