import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    subject: '',
    senderName: '',
    senderEmail: '',
};

export const scheduledCampaignSenderDetailsSlice = createSlice({
    name: 'scheduledCampaignSenderDetails',
    initialState: () => initialState,
    reducers: {
        updateSenderDetails: (state, action) => {
            state.subject = action.payload.subject;
            state.senderName = action.payload.senderName;
            state.senderEmail = action.payload.senderEmail;
        },
        resetSenderDetails: (state, action) => {
            Object.assign(state, initialState)
        }
    }
})

export const {
    updateSenderDetails,
    resetSenderDetails
} = scheduledCampaignSenderDetailsSlice.actions
export default scheduledCampaignSenderDetailsSlice.reducer