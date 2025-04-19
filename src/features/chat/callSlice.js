import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
    name: "call",
    initialState: {
        currentCall: null,
        incomingCall: null,
    },
    reducers: {
        setCallStarted: (state, action) => {
            console.log("✅ Reducer setCallStarted:", action.payload);
            state.currentCall = action.payload;
        },
        setIncomingCall: (state, action) => {
            state.incomingCall = action.payload;
        },
        clearIncomingCall: (state) => {
            state.incomingCall = null;
        },
        endCall: (state) => {
            state.currentCall = null;
            state.incomingCall = null;
        },
    },
});

export const {
    setCallStarted,
    setIncomingCall,
    clearIncomingCall,
    endCall,
} = callSlice.actions;

export default callSlice.reducer;
