import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    date: '',
    time: ''
};

export const scheduledCampaignSchedulingSlice = createSlice({
    name: 'scheduledCampaignScheduling',
    initialState: () => initialState,
    reducers: {
        updateSchedulingDetails: (state, action) => {
            return Object.assign(state, action.payload)
        },
        resetSchedulingDetails: (state, action) => {
            return Object.assign(state, initialState)
        }
    }
})

export const {
    updateSchedulingDetails,
    resetSchedulingDetails
} = scheduledCampaignSchedulingSlice.actions
export default scheduledCampaignSchedulingSlice.reducer