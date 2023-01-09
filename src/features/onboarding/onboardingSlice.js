import {createSlice} from "@reduxjs/toolkit";
import subscriberType from "../../Onboarding/SubscriberType";

const initialState = {
    importSubscribers: {
        areSubscribers: subscriberType.Subscribed,
        importedSubscribers: []
    },
    simpleTemplate: {},
    amazonSesIntegration: {}
};

export const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState: () => initialState,
    reducers: {
        updateOnboarding: (state, action) => {
            return {...action.payload};
        }
    }
})

export const { updateOnboarding } = onboardingSlice.actions
export default onboardingSlice.reducer