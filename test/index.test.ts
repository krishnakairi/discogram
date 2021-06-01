import { Discogram } from './../src';
import * as wrtc from 'wrtc';
import Initiator from '../src/initiator';
import NonInitiator from '../src/non-initiator';

describe("Basic Peers Connection", () => {
    let initiatorPeer: Initiator;
    let nonInitiatorPeer: NonInitiator;
    let requestId: string;
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

    it("should allow non-initiator to request using initiator's peerId and requestId", async () => {
        await nonInitiatorPeer.request(initiatorPeer.peerId, initiatorPeer.requestId);
        expect(nonInitiatorPeer.answer).toBeDefined();
        requestId = initiatorPeer.requestId;
    });

    it("should allow initiator to accept request using initiator's requestId", async () => {
        const p1$ = initiatorPeer.signal('connect');
        const p2$ = nonInitiatorPeer.signal('connect');

        await initiatorPeer.accept(requestId);

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
