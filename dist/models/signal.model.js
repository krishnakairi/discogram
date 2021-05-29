"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Chance = require("chance");
var Signal = /** @class */ (function () {
    function Signal(signal) {
        var chance = new Chance();
        this.id = signal.id;
        this.sdp = signal.sdp;
        this.type = signal.type;
        this.timeStamp = new Date().getTime();
        this.requestId = (this.type === 'offer') ? chance.string({ length: 5, pool: '0123456789' }) : signal.requestId;
    }
    Signal.prototype.toUpdate = function () {
        return this.id + ":" + this.timeStamp + ":" + this.type + ":" + this.requestId + "_" + this.sdp;
    };
    return Signal;
}());
exports.default = Signal;
