import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    drawerOpened: false,
    subscriberId: ''
};

export const subscriberDetailsDrawerSlice = createSlice({
    name: 'subscriberDetailsDrawer',
    initialState: () => initialState,
    reducers: {
        updateSubscriberDetailsDrawer: (state, action) => {
            state.drawerOpened = action.payload.drawerOpened;
            state.subscriberId = action.payload.subscriberId;
            
            return state;
        },
    }
})

export const { updateSubscriberDetailsDrawer } = subscriberDetailsDrawerSlice.actions
export default subscriberDetailsDrawerSlice.reducer