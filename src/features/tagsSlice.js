import {createSlice} from "@reduxjs/toolkit";

const initialState = [];

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: () => initialState,
    reducers: {
        updateSelectedTags: (state, action) => {
            return [...action.payload];
        },
        resetSelectedTags: (state, action) => {
            return [];
        }
    }
})

export const {
    updateSelectedTags,
    resetSelectedTags} = tagsSlice.actions
export default tagsSlice.reducer