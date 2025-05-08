import { createSlice } from "@reduxjs/toolkit";
import callChannel from "../../utils/callChannel";

const initialState = {
    currentCall: null,
    incomingCall: null,
};

const callSlice = createSlice({
    name: "call",
    initialState,
    reducers: {
        setCallStarted: (state, action) => {
            state.currentCall = action.payload;
            callChannel.postMessage({ type: "START_CALL", payload: action.payload });
        },
        endCall: (state) => {
            state.currentCall = null;
            state.incomingCall = null;
            callChannel.postMessage({ type: "END_CALL" });
        },
        setIncomingCall: (state, action) => {
            state.incomingCall = action.payload;
        },
        clearIncomingCall: (state) => {
            state.incomingCall = null;
        },
    }
});

export const { setCallStarted, endCall, setIncomingCall, clearIncomingCall } = callSlice.actions;
export default callSlice.reducer;
