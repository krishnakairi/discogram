import { ISignal } from '../constants';
import * as unixTime from 'unix-time';
export default class Updates {
    private updates: any[];

    constructor(updates) {
        this.updates = updates;
    }

    toSignals(): ISignal[] {
        return this.updates.map(update => {
            const text = update?.channel_post?.text || '';
            const timeStamp = update?.channel_post?.date;
            const key = text.substring(0, 5);
            const msg = text.substring(5);
            const [meta = '', sdp = ''] = msg.split('_');
            const [type, id] = meta.split(':');
            return {
                id,
                type,
                sdp: `${sdp}\r\n`,
                key,
                timeStamp
            }
        });
    }

    getOffset(expiryInMins: number): number {
        let offset = 0;
        this.updates.forEach(item => {
            const updateId = item?.update_id;
            const msgTimeStamp = item?.channel_post?.date;
            const now = unixTime(new Date());
            if (Math.floor((now - msgTimeStamp) / 60) > expiryInMins) {
                offset = updateId + 1
            }
        });
        return offset
    }
}
