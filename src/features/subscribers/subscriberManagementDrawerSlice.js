import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    importOpened: false,
    sendEmailsByTags: false,
    sendEmailsForSubscribers: false
};

export const subscriberManagementDrawerSlice = createSlice({
    name: 'subscriberManagementDrawer',
    initialState: () => initialState,
    reducers: {
        setSubscriberManagementDrawerState: (state, action) => {
            state.importOpened = action.payload.importOpened;
            state.sendEmailsByTags = action.payload.sendEmailsByTags;
            state.sendEmailsForSubscribers = action.payload.sendEmailsForSubscribers
            
            return state;
        },
    }
})

export const { setSubscriberManagementDrawerState } = subscriberManagementDrawerSlice.actions
export default subscriberManagementDrawerSlice.reducer