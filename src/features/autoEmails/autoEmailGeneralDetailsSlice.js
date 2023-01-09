import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: '',
    emailTemplateId: null
};

export const autoEmailGeneralDetailsSlice = createSlice({
    name: 'autoEmailGeneralDetails',
    initialState: () => initialState,
    reducers: {
        updateAutoEmailGeneralDetails: (state, action) => {
            return Object.assign(state, action.payload)
        },
        resetAutoEmailGeneralDetails: (state, action) => {
            return Object.assign(state, initialState)
        }
    }
})

export const {
    updateAutoEmailGeneralDetails,
    resetAutoEmailGeneralDetails} = autoEmailGeneralDetailsSlice.actions
export default autoEmailGeneralDetailsSlice.reducer