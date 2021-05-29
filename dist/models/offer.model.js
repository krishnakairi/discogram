"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Offer = /** @class */ (function () {
    function Offer(offer, msgSize) {
        if (msgSize === void 0) { msgSize = 3000; }
        this.offer = offer;
        this.msgSize = msgSize;
        this.timeStamp = new Date().getTime();
    }
    Offer.prototype.toUpdates = function () {
        return this.getMessages();
    };
    Offer.prototype.getMessages = function () {
        var _this = this;
        var chunks = this.getChunks();
        var length = chunks.length;
        return chunks.map(function (chunk, index) {
            var last = (length === index + 1) ? 1 : 0;
            return _this.timeStamp + ":" + index + ":" + last + "_" + chunk;
        });
    };
    Offer.prototype.getChunks = function () {
        var strLength = this.offer.length;
        var numChunks = Math.ceil(strLength / this.msgSize);
        var chunks = new Array(numChunks);
        var i = 0;
        var o = 0;
        for (; i < numChunks; ++i, o += this.msgSize) {
            chunks[i] = this.offer.substr(o, this.msgSize);
        }
        return chunks;
    };
    return Offer;
}());
exports.default = Offer;
