import {createSlice} from "@reduxjs/toolkit";

const initialState = null;

export const sendingEmailsSlice = createSlice({
    name: 'sendingEmails',
    initialState: () => initialState,
    reducers: {
        updateSendingEmails: (state, action) => {
            debugger
            if (action.payload)
                state = action.payload;
            else
                state = null
            
            return state;
        },
        resetSendingEmails: (state, action) => {
            state = null;
            return state;
        }
    }
})

export const {
    updateSendingEmails,
    resetSendingEmails
} = sendingEmailsSlice.actions
export default sendingEmailsSlice.reducer