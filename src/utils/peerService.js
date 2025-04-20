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
        this.onSignal = this._onSignal.bind(this);
        this.config = {
            iceServers: [
                { urls: "stun:ss-turn2.xirsys.com" },
                {
                    username: "BqQedRrqX2gbyE-VQucoLtiCToWi3Txj95qC-_j77Tf6JIMtO0qW3-YLh6aGpxmwAAAAAGgDH_1nZ2R1Y2s=",
                    credential: "e83406e2-1cd2-11f0-a3ab-0242ac140004",
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

    async init({ userId, peerId, conversationId, stream, initiator }) {
        this.localPeerId = peerId;
        this.conversationId = conversationId;
        this.localStream = stream;

        this.peer = new SimplePeer({
            initiator,
            trickle: false,
            stream,
            config: this.config
        });

        // Gửi signal (offer / answer)
        this.peer.on("signal", (signal) => {
            socket.emit(SOCKET_EVENTS.CALL_USER, {
                from: this.localPeerId,
                conversationId: this.conversationId,
                signal,
            });
        });

        // Khi nhận được stream từ peer
        this.peer.on("stream", (remoteStream) => {
            if (this.remoteStreamCallback) {
                this.remoteStreamCallback(remoteStream);
            }
        });

        this.peer.on("connect", () => console.log("✅ Peer connected"));
        this.peer.on("error", (err) => console.error("❌ Peer error", err));
        this.peer.on("close", () => console.log("🔒 Peer closed"));

        // Lắng nghe signal từ server
        socket.on(SOCKET_EVENTS.RECEIVE_SIGNAL, this.onSignal);

        // Đăng ký vào room call
        socket.emit(SOCKET_EVENTS.SUBSCRIBE_CALL_AUDIO, {
            conversationId,
            userId,
            peerId
        });
    }

    _onSignal({ from, signal, conversationId }) {
        if (conversationId !== this.conversationId) return;
        if (!this.peer) return;
        if (from === this.localPeerId) return;
        this.peer.signal(signal);
    }

    onRemoteStream(cb) {
        this.remoteStreamCallback = cb;
    }

    endCall() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = null;
        }

        socket.off(SOCKET_EVENTS.RECEIVE_SIGNAL, this.onSignal);
        this.remoteStreamCallback = null;
        this.localPeerId = null;
        this.conversationId = null;
    }

    toggleAudio() {
        if (!this.localStream) return false;
        const audioTrack = this.localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            return !audioTrack.enabled;
        }
        return false;
    }

    toggleVideo() {
        if (!this.localStream) return false;
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            return !videoTrack.enabled;
        }
        return false;
    }
}

export default new PeerService();
