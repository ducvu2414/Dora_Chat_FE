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
    }

    /**
     * Init local stream & create peer for self (initiator)
     */
    async init({ userId, conversationId, stream, initiator = false, type }) {
        this.userId = userId;
        this.conversationId = conversationId;
        this.localStream = stream;
        this.type = type;
        this.initialized = true;

        // Only initiator starts signaling
        if (initiator) {
            this._createPeer(userId, initiator);
        }
    }

    /**
     * Create a SimplePeer connection to another user
     */
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

    /**
     * Receive signal from another peer
     */
    receiveSignal({ from, signal, conversationId }) {
        if (conversationId !== this.conversationId) return;

        if (!this.peers.has(from)) {
            this._createPeer(from, false);
        }

        const peer = this.peers.get(from);
        if (peer) {
            peer.signal(signal);
        }
    }

    /**
     * End all connections and cleanup
     */
    endCall() {
        this.peers.forEach((peer, id) => {
            try {
                peer.destroy();
            } catch (err) {
                console.warn(`Error destroying peer ${id}`, err);
            }
        });

        this.peers.clear();
        this.localStream?.getTracks().forEach((track) => track.stop());
        this.initialized = false;
        this.localStream = null;
        this.userId = null;
        this.conversationId = null;
        this.type = null;
    }

    /**
     * Get list of connected peers
     */
    getConnectedPeerIds() {
        return Array.from(this.peers.keys());
    }
}

const peerService = new SimplePeerService();
export default peerService;
