import { get } from 'lodash';
import { ISignal } from '../constants';

export default class Updates {
    private updates: any[];

    constructor(updates) {
        this.updates = updates;
    }

    toSignals(): ISignal[] {
        return this.updates.map(update => {
            const text = get(update, 'channel_post.text', '');
            const [meta, sdp] = text.split('_');
            const [id, timeStamp, type, requestId] = meta.split(':');
            return {
                id,
                timeStamp,
                type,
                sdp: `${sdp}\r\n`,
                requestId
            }
        });
    }
}