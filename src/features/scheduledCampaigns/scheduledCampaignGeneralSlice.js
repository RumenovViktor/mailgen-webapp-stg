import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: '',
    emailTemplateId: null,
    enableOpenRate: true,
    enableClickTracking: true,
    tags: []
};

export const scheduledCampaignGeneralSlice = createSlice({
    name: 'scheduledCampaignGeneral',
    initialState: () => initialState,
    reducers: {
        updateGeneralDetails: (state, action) => {
            return Object.assign(state, action.payload)
        },
        resetGeneralDetails: (state, action) => {
            return Object.assign(state, initialState)
        }
    }
})

export const {
    updateGeneralDetails, 
    resetGeneralDetails} = scheduledCampaignGeneralSlice.actions
export default scheduledCampaignGeneralSlice.reducer