import { createSlice, createAction } from "@reduxjs/toolkit";

export const endCall = createAction("call/end");

const initialState = {
    currentCall: null,
    incomingCall: null,
    currentGroupCall: null,
};

const callSlice = createSlice({
    name: "call",
    initialState,
    reducers: {
        setCallStarted: (state, action) => {
            state.currentCall = action.payload;
        },
        setIncomingCall: (state, action) => {
            state.incomingCall = action.payload;
        },
        clearIncomingCall: (state) => {
            state.incomingCall = null;
        },
        setGroupCallStarted: (state, action) => {
            state.currentGroupCall = action.payload;

        },
        endGroupCall: (state) => {
            state.currentGroupCall = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(endCall, (state) => {
            state.currentCall = null;
            state.incomingCall = null;
            state.currentGroupCall = null;
        });
    },
});

export const {
    setCallStarted,
    setIncomingCall,
    clearIncomingCall,
    setGroupCallStarted,
    endGroupCall
} = callSlice.actions;

export default callSlice.reducer;
