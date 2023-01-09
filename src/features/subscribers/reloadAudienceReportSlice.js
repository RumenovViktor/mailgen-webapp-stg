import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    reload: false
};

export const reloadAudienceReportSlice = createSlice({
    name: 'reloadAudienceReport',
    initialState: () => initialState,
    reducers: {
        setShouldReload: (state, action) => {
            state.reload = action.payload.reload;
            return state;
        },
    }
})

export const { setShouldReload } = reloadAudienceReportSlice.actions
export default reloadAudienceReportSlice.reducer