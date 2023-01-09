import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: true,
    emailTemplateId: true,
    enableOpenRate: true,
    enableClickTracking: true,
    date: true,
    time: true,
    subject: true,
    senderName: true,
    tags: true
};

export const scheduledCampaignValidationSlice = createSlice({
    name: 'scheduledCampaignValidations',
    initialState: () => initialState,
    reducers: {
        updateScheduledCampaignValidation: (state, action) => {
            return Object.assign(state, action.payload)
        },
        resetScheduledCampaignValidation: (state, action) => {
            return Object.assign(state, initialState)
        }
    }
})

export const {
    updateScheduledCampaignValidation,
    resetScheduledCampaignValidation} = scheduledCampaignValidationSlice.actions
export default scheduledCampaignValidationSlice.reducer