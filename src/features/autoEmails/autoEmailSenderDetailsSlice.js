import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    subject: '',
    senderName: '',
    senderEmail: '',
};

export const autoEmailSenderDetailsSlice = createSlice({
    name: 'autoEmailSenderDetails',
    initialState: () => initialState,
    reducers: {
        updateAutoEmailSenderDetails: (state, action) => {
            return Object.assign(state, action.payload)
        },
        resetAutoEmailSenderDetails: (state, action) => {
            return Object.assign(state, initialState)
        }
    }
})

export const {
    updateAutoEmailSenderDetails,
    resetAutoEmailSenderDetails
} = autoEmailSenderDetailsSlice.actions
export default autoEmailSenderDetailsSlice.reducer