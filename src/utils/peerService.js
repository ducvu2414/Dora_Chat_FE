import SimplePeer from "simple-peer";
import { socket } from "./socketClient";
import { SOCKET_EVENTS } from "./constant";

class PeerService {
    constructor() {
        this.peer = null;
        this.localStream = null;
        this.conversationId = null;
        this.localPeerId = null;
        this.remoteStreamCallback = null;
        this.remoteUsers = {};      // map peerId → userName
        this.negotiated = false;
        this._ended = false;

        this.onSignal = this._onSignal.bind(this);
        this.onCallEnded = this._onCallEnded.bind(this);

        this.config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' },
            ]
        };
    }

    async init({ peerId, userName, conversationId, stream, initiator, type }) {
        // 0) teardown peer cũ
        await this.endCall();
        this._ended = false;
        this.negotiated = false;

        // 1) state
        this.localPeerId = peerId;
        this.conversationId = conversationId;
        this.localStream = stream;
        this.remoteUsers[peerId] = userName;

        // 2) khởi tạo SimplePeer với metadata
        this.peer = new SimplePeer({
            initiator,
            trickle: false,
            stream,
            config: this.config,
            metadata: { userId: peerId, userName },
            sdpTransform: (sdp) => {
                return sdp.replace(
                    /a=fmtp:111 minptime=10;useinbandfec=1/g,
                    'a=fmtp:111 minptime=10;useinbandfec=1;maxaveragebitrate=64000'
                );
            }
        });

        // 3) emit signal kèm conversationId
        this.peer.on("signal", (signal) => {
            socket.emit(SOCKET_EVENTS.CALL_USER, {
                from: this.localPeerId,
                fromName: userName,
                conversationId,
                signal,
            });
        });

        // 4) handshake xong
        this.peer.on("connect", () => {
            this.negotiated = true;
        });

        // 5) khi có remote stream
        this.peer.on("stream", (remoteStream) => {
            this.remoteStreamCallback?.(
                remoteStream,
                this.remoteUsers // có thể lookup tên ở component
            );
        });

        // 6) lắng nghe lỗi / close
        this.peer.on("error", (err) => console.error("Peer error", err));
        this.peer.on("close", () => console.log("Peer closed"));

        // 7) subscribe tín hiệu
        socket.on(SOCKET_EVENTS.RECEIVE_SIGNAL, this.onSignal);
        socket.on(SOCKET_EVENTS.CALL_ENDED, this.onCallEnded);

        // 8) vào room
        const ev =
            type === "video"
                ? SOCKET_EVENTS.SUBSCRIBE_CALL_VIDEO
                : SOCKET_EVENTS.SUBSCRIBE_CALL_AUDIO;

        socket.emit(ev, {
            conversationId,
            peerId: this.localPeerId,
            userName,
        });
    }

    _onSignal({ from, fromName, signal, conversationId }) {
        if (
            conversationId !== this.conversationId ||
            !this.peer ||
            this.negotiated
        )
            return;

        // cập nhật tên
        this.remoteUsers[from] = fromName;

        if (from === this.localPeerId) return;
        this.peer.signal(signal);
    }

    _onCallEnded({ conversationId }) {
        if (conversationId === this.conversationId) {
            this.endCall();
        }
    }

    onRemoteStream(cb) {
        // cb(remoteStream, remoteUsersMap)
        this.remoteStreamCallback = cb;
    }

    endCall() {
        return new Promise((resolve) => {
            if (!this._ended && this.conversationId) {
                socket.emit(SOCKET_EVENTS.END_CALL, {
                    conversationId: this.conversationId,
                });
                socket.emit(SOCKET_EVENTS.LEAVE_CALL, this.conversationId);
                this._ended = true;
            }

            this.peer?.destroy();
            this.localStream?.getTracks().forEach((t) => t.stop());

            socket.off(SOCKET_EVENTS.RECEIVE_SIGNAL, this.onSignal);
            socket.off(SOCKET_EVENTS.CALL_ENDED, this.onCallEnded);

            this.peer = null;
            this.localStream = null;
            this.localPeerId = null;
            this.conversationId = null;
            this.remoteStreamCallback = null;
            this.negotiated = false;
            this.remoteUsers = {};

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
