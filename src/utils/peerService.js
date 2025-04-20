import SimplePeer from "simple-peer";
import { socket } from "./socketClient";
import { SOCKET_EVENTS } from "./constant";

class SimplePeerService {
    constructor() {
        this.peers = new Map(); // Map<userId, SimplePeer>
        this.localStream = null;
        this.userId = null;
        this.conversationId = null;
        this.type = null;
        this.initialized = false;
        this.remoteStreamCallbacks = new Map(); // Map<userId|*, callback>
    }

    async init({ userId, conversationId, stream, initiator = false, type }) {
        if (this.initialized) {
            console.warn("🔁 peerService already initialized. Ending previous call.");
            this.endCall(); // cleanup trước
        }

        this.userId = userId;
        this.conversationId = conversationId;
        this.localStream = stream;
        this.type = type;
        this.initialized = true;

        console.log("📡 [peerService] Initialized");

        if (initiator) {
            console.log("📞Socket emit SUBSCRIBE_CALL_AUDIO");
            socket.emit(
                type === "audio" ? SOCKET_EVENTS.SUBSCRIBE_CALL_AUDIO : SOCKET_EVENTS.SUBSCRIBE_CALL_VIDEO,
                { conversationId, userId, peerId: this.userId }
            );
        }
    }


    onRemoteStream(userIdOrWildcard, callback) {
        this.remoteStreamCallbacks.set(userIdOrWildcard, callback);
    }

    emitRemoteStream(userId, stream) {
        if (this.remoteStreamCallbacks.has(userId)) {
            this.remoteStreamCallbacks.get(userId)(stream, userId);
        }
        if (this.remoteStreamCallbacks.has('*')) {
            this.remoteStreamCallbacks.get('*')(stream, userId);
        }
    }

    isInitialized() {
        return this.initialized;
    }


    _createPeer(partnerId, initiator) {
        const peer = new SimplePeer({
            initiator,
            trickle: false,
            stream: this.localStream,
        });

        peer.on("signal", (signal) => {
            socket.emit(SOCKET_EVENTS.CALL_USER, {
                from: this.userId,
                conversationId: this.conversationId,
                signal,
            });
        });

        peer.on("stream", (remoteStream) => {
            console.log(`📡 Received stream from ${partnerId}`);
            this.emitRemoteStream(partnerId, remoteStream);
        });

        peer.on("connect", () => {
            console.log(`✅ Peer connected with ${partnerId}`);
        });

        peer.on("error", (err) => {
            console.error(`❌ Peer error with ${partnerId}:`, err);
        });

        peer.on("close", () => {
            console.log(`🔒 Peer closed with ${partnerId}`);
            this.peers.delete(partnerId);
        });

        this.peers.set(partnerId, peer);
    }

    setOnRemoteStream(callback) {
        this.onRemoteStream("*", callback);
    }

    /**
     * Handle signal from another user
     */
    receiveSignal({ from, signal, conversationId }) {
        if (conversationId !== this.conversationId) return;

        if (!this.peers.has(from)) {
            this._createPeer(from, false);
        }

        const peer = this.peers.get(from);
        try {
            peer.signal(signal);
        } catch (e) {
            console.warn("⚠️ Skipped duplicate or invalid signal from", from);
        }
    }

    /**
     * Register a callback for remote streams
     */
    onRemoteStream(userId = "*", callback) {
        this.remoteStreamCallbacks.set(userId, callback);
    }

    /**
     * End all peers and cleanup
     */
    endCall() {
        this.peers.forEach((peer, id) => {
            try {
                console.log(`🔒 Ending call with ${id}`);
                peer.destroy();
            } catch (err) {
                console.warn(`Error destroying peer ${id}`, err);
            }
        });

        this.peers.clear();
        this.remoteStreamCallbacks.clear();

        this.localStream?.getTracks().forEach((track) => track.stop());
        this.localStream = null;
        this.userId = null;
        this.conversationId = null;
        this.type = null;
        this.initialized = false;
    }

    /**
     * Toggle audio
     */
    toggleAudio() {
        const audioTracks = this.localStream?.getAudioTracks();
        if (audioTracks && audioTracks.length > 0) {
            audioTracks[0].enabled = !audioTracks[0].enabled;
            return !audioTracks[0].enabled;
        }
        return false;
    }

    /**
     * Get all connected peers
     */
    getConnectedPeerIds() {
        return Array.from(this.peers.keys());
    }

    toggleAudio() {
        const audioTracks = this.localStream?.getAudioTracks();
        if (audioTracks && audioTracks.length > 0) {
            audioTracks[0].enabled = !audioTracks[0].enabled;
            return !audioTracks[0].enabled;
        }
        return false;
    }

    toggleVideo() {
        const videoTracks = this.localStream?.getVideoTracks();
        if (videoTracks && videoTracks.length > 0) {
            videoTracks[0].enabled = !videoTracks[0].enabled;
            return !videoTracks[0].enabled;
        }
        return false;
    }
}

const peerService = new SimplePeerService();
export default peerService;
