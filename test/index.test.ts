import * as wrtc from 'wrtc';
import * as Chance from 'chance';
import { Discogram } from './../src';
import Initiator from '../src/initiator';
import NonInitiator from '../src/non-initiator';

function getRandomKey(): string {
    const chance = new Chance();
    return chance.string({ length: 5, casing: 'upper', alpha: true, numeric: true });
}

describe("Basic Peers Connection", () => {
    let initiatorPeer: Initiator;
    let nonInitiatorPeer: NonInitiator;
    let key: string;
    const discogram = new Discogram({
        channelId: +process.env.DISCOGRAM_CHANNEL_ID,
        receiverBotToken: process.env.DISCOGRAM_RECEIVER_BOT_TOKEN,
        senderBotToken: process.env.DISCOGRAM_SENDER_BOT_TOKEN
    });

    it("should publish peer offer when initiatior set to true", async () => {
        initiatorPeer = await discogram.createPeer({ initiator: true, wrtc }) as Initiator
        expect(initiatorPeer.offer).toBeDefined();

    });

    it("should not publish peer offer when initiatior set to false", async () => {
        nonInitiatorPeer = await discogram.createPeer({ initiator: false, wrtc }) as NonInitiator
        expect(nonInitiatorPeer.answer).toBeUndefined();
    });

    it("should allow non-initiator to request using initiator's peerId and key", async () => {
        key = getRandomKey();
        const { signal, expiresInMs } = await nonInitiatorPeer.getSingal(initiatorPeer.peerId)
        await nonInitiatorPeer.request(signal, key);
        expect(nonInitiatorPeer.answer).toBeDefined();
    });

    it("should allow initiator to accept request using initiator's key", async () => {
        const p1$ = initiatorPeer.firstEvent('connect');
        const p2$ = nonInitiatorPeer.firstEvent('connect');

        await initiatorPeer.accept(key);

        await Promise.all([p1$, p2$]);
    
        expect(initiatorPeer.peerInstance.connected).toBeTruthy()
        expect(nonInitiatorPeer.peerInstance.connected).toBeTruthy()
    });

    it("should create connection between initiator and non-initiator", (done) => {
        const peer1 = initiatorPeer.peerInstance;
        const peer2 = nonInitiatorPeer.peerInstance;

        expect(peer1.initiator).toBeTruthy()
        expect(peer2.initiator).toBeFalsy()

        peer1.send('sup peer2')
        peer2.on('data', function (data) {
            expect(Buffer.isBuffer(data)).toBeTruthy()
            expect(data.toString()).toEqual('sup peer2');

            peer2.send('sup peer1')
            peer1.on('data', function (data) {
                expect(Buffer.isBuffer(data)).toBeTruthy()
                expect(data.toString()).toEqual('sup peer1');
                done();
            })
        });
    });
});
