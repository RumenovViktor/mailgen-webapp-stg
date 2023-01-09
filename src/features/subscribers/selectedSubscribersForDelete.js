import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    openWarning: false,
    audience: []
};

export const selectedSubscribersForDeleteSlice = createSlice({
    name: 'selectedSubscribersForDelete',
    initialState: () => initialState,
    reducers: {
        addSubscribersForDelete: (state, action) => {
            state.openWarning = action.payload.openWarning;
            state.audience = action.payload.audience;
            
            return state;
        },
        resetAddedSubscriberForDelete: (state, action) => Object.assign(state, initialState)
    }
})

export const {
    addSubscribersForDelete,
    resetAddedSubscriberForDelete} = selectedSubscribersForDeleteSlice.actions
export default selectedSubscribersForDeleteSlice.reducer