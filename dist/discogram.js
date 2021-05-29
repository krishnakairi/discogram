"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discogram = void 0;
var EventEmitter = require("eventemitter3");
var peer_1 = require("./peer");
var message_service_1 = require("./services/message.service");
var Discogram = /** @class */ (function (_super) {
    __extends(Discogram, _super);
    function Discogram(config) {
        var _this = _super.call(this) || this;
        _this.peers = [];
        _this.messageServce = message_service_1.default.getInstance();
        _this.messageServce.init(config);
        return _this;
    }
    Discogram.prototype.getPeers = function () {
        return this.peers;
    };
    Discogram.prototype.createPeer = function (peerConfig) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var peer = new peer_1.default(peerConfig);
            peer.on('announced', function () {
                _this.peers.push(peer);
                resolve(peer);
            });
        });
    };
    return Discogram;
}(EventEmitter));
exports.Discogram = Discogram;
