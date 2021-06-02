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
            const [id, type, initiatorId, key] = meta.split(':');
            return {
                id,
                type,
                sdp: `${sdp}\r\n`,
                key,
                initiatorId
            }
        });
    }
}