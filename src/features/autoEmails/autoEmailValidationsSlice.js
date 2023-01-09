import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: true,
    emailTemplateId: true,
    subject: true,
    senderName: true,
    senderEmail: true,
    tags: true
};

export const autoEmailValidationsSlice = createSlice({
    name: 'autoEmailValidations',
    initialState: () => initialState,
    reducers: {
        updateAutoEmailValidation: (state, action) => {
            return Object.assign(state, action.payload)
        },
        resetAutoEmailValidations: (state, action) => {
            return Object.assign(state, initialState)
        },
    }
})

export const { 
    updateAutoEmailValidation,
    resetAutoEmailValidations} = autoEmailValidationsSlice.actions
export default autoEmailValidationsSlice.reducer