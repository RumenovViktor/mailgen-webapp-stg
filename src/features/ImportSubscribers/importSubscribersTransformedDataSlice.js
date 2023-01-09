import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    imported: [],
    modifiedFieldsValues: {email: ''}
};

export const importSubscribersTransformedDataSlice = createSlice({
    name: 'importSubscribersTransformedData',
    initialState: () => initialState,
    reducers: {
        updateImportSubscribersTransformedData: (state, action) => {
            return {
                ...state,
                imported: [...action.payload.imported],
                modifiedFieldsValues: {
                    ...action.payload.modifiedFieldsValues
                }
            };
        },
        updateSingleTransformedField: (state, action) => {
            state.modifiedFieldsValues[action.payload.key] = action.payload.value;
            return state;
        },
        updateImportedAudienceData: (state, action) => {
            state.imported = action.payload;
            return state;
        }
    }
})

export const { 
    updateImportSubscribersTransformedData,
    updateSingleTransformedField,
    updateImportedAudienceData
} = importSubscribersTransformedDataSlice.actions;
export default importSubscribersTransformedDataSlice.reducer;