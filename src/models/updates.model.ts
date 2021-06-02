import { ISignal } from '../constants';

export default class Updates {
    private updates: any[];

    constructor(updates) {
        this.updates = updates;
    }

    toSignals(): ISignal[] {
        return this.updates.map(update => {
            const text = update?.channel_post?.text || '';
            const key = text.substring(0, 5);
            const msg = text.substring(5);
            const [meta = '', sdp = ''] = msg.split('_');
            const [type, id] = meta.split(':');
            return {
                id,
                type,
                sdp: `${sdp}\r\n`,
                key
            }
        });
    }
}
