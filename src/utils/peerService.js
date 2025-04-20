import SimplePeer from "simple-peer";
import { socket } from "./socketClient";
import { SOCKET_EVENTS } from "./constant";

class PeerService {
    constructor() {
        this.peer = null;
        this.localStream = null;
        this.localPeerId = null;
        this.conversationId = null;
        this.remoteStreamCallback = null;
        this.negotiated = false;
        this._ended = false;

        this.onSignal = this._onSignal.bind(this);
        this.onCallEnded = this._onCallEnded.bind(this);

        this.config = {
            iceServers: [
                { urls: "stun:ss-turn2.xirsys.com" },
                {
                    username: "…",
                    credential: "…",
                    urls: [
                        "turn:ss-turn2.xirsys.com:80?transport=udp",
                        "turn:ss-turn2.xirsys.com:3478?transport=udp",
                        "turn:ss-turn2.xirsys.com:80?transport=tcp",
                        "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                        "turns:ss-turn2.xirsys.com:443?transport=tcp",
                        "turns:ss-turn2.xirsys.com:5349?transport=tcp"
                    ]
                }
            ]
        };
    }

    async init({ peerId, conversationId, stream, initiator, type }) {
        // teardown peer cũ
        await this.endCall();
        this._ended = false;
        this.negotiated = false;

        this.localPeerId = peerId;
        this.conversationId = conversationId;
        this.localStream = stream;

        this.peer = new SimplePeer({
            initiator,
            trickle: false,
            stream,
            config: this.config
        });

        this.peer.on("signal", (signal) => {
            socket.emit(SOCKET_EVENTS.CALL_USER, { signal, conversationId });
        });
        this.peer.on("connect", () => { this.negotiated = true; });
        this.peer.on("stream", (remoteStream) => {
            this.remoteStreamCallback?.(remoteStream);
        });
        this.peer.on("error", (err) => console.error("Peer error", err));
        this.peer.on("close", () => console.log("Peer closed"));

        socket.on(SOCKET_EVENTS.RECEIVE_SIGNAL, this.onSignal);
        socket.on(SOCKET_EVENTS.CALL_ENDED, this.onCallEnded);

        // subscribe call room
        const ev = type === "video"
            ? SOCKET_EVENTS.SUBSCRIBE_CALL_VIDEO
            : SOCKET_EVENTS.SUBSCRIBE_CALL_AUDIO;
        socket.emit(ev, { conversationId, peerId });
    }

    _onSignal({ from, signal, conversationId }) {
        if (
            conversationId !== this.conversationId ||
            !this.peer ||
            this.negotiated
        ) return;
        if (from === this.localPeerId) return;
        this.peer.signal(signal);
    }

    _onCallEnded({ conversationId }) {
        if (conversationId === this.conversationId) {
            console.log("Call ended by remote");
            this.endCall();
        }
    }

    onRemoteStream(cb) {
        this.remoteStreamCallback = cb;
    }

    endCall() {
        return new Promise((resolve) => {
            if (!this._ended && this.conversationId) {
                socket.emit(SOCKET_EVENTS.END_CALL, { conversationId: this.conversationId });
                socket.emit(SOCKET_EVENTS.LEAVE_CALL, this.conversationId);
                this._ended = true;
            }

            this.peer?.destroy();
            this.localStream?.getTracks().forEach(t => t.stop());

            socket.off(SOCKET_EVENTS.RECEIVE_SIGNAL, this.onSignal);
            socket.off(SOCKET_EVENTS.CALL_ENDED, this.onCallEnded);

            this.peer = null;
            this.localStream = null;
            this.localPeerId = null;
            this.conversationId = null;
            this.remoteStreamCallback = null;
            this.negotiated = false;

            resolve();
        });
    }


    toggleAudio() {
        if (!this.localStream) return false;
        const track = this.localStream.getAudioTracks()[0];
        if (!track) return false;
        track.enabled = !track.enabled;
        return !track.enabled;
    }

    toggleVideo() {
        if (!this.localStream) return false;
        const track = this.localStream.getVideoTracks()[0];
        if (!track) return false;
        track.enabled = !track.enabled;
        return !track.enabled;
    }
}

export default new PeerService();
