"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Updates = /** @class */ (function () {
    function Updates(updates) {
        this.updates = updates;
    }
    Updates.prototype.toSignals = function () {
        return this.updates.map(function (update) {
            var text = lodash_1.get(update, 'channel_post.text', '');
            var _a = text.split('_'), meta = _a[0], sdp = _a[1];
            var _b = meta.split(':'), id = _b[0], timeStamp = _b[1], type = _b[2], requestId = _b[3];
            return {
                id: id,
                timeStamp: timeStamp,
                type: type,
                sdp: sdp + "\r\n",
                requestId: requestId
            };
        });
    };
    return Updates;
}());
exports.default = Updates;
