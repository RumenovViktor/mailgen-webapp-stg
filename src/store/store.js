import {configureStore} from "@reduxjs/toolkit";
import scheduledCampaignGeneralReducer from '../features/scheduledCampaigns/scheduledCampaignGeneralSlice'
import scheduledCampaignSchedulingReducer from '../features/scheduledCampaigns/scheduledCampaignSchedulingSlice'
import scheduledCampaignSenderDetailsReducer from '../features/scheduledCampaigns/scheduledCampaignSenderDetailsSlice'
import tagsReducer from '../features/tagsSlice'
import sendingEmailsReducer from '../features/sendingEmailsSlice'
import scheduledCampaignValidationReducer from "../features/scheduledCampaigns/validationSlice";
import selectedSubscribersForDeleteReducer from "../features/subscribers/selectedSubscribersForDelete";
import reloadAudienceReportReducer from "../features/subscribers/reloadAudienceReportSlice";
import subscriberDetailsDrawerReducer from "../features/subscribers/subscriberDetailsDrawer";
import subscriberManagementDrawerReducer from "../features/subscribers/subscriberManagementDrawerSlice";
import autoEmailGeneralDetailsReducer from "../features/autoEmails/autoEmailGeneralDetailsSlice";
import autoEmailSenderDetailsReducer from "../features/autoEmails/autoEmailSenderDetailsSlice";
import autoEmailValidationsReducer from "../features/autoEmails/autoEmailValidationsSlice";
import onboardingReducer from "../features/onboarding/onboardingSlice";
import importSubscribersTransformedDataReducer from "../features/ImportSubscribers/importSubscribersTransformedDataSlice";

export default configureStore({
    reducer: {
        scheduledCampaignGeneral: scheduledCampaignGeneralReducer,
        scheduledCampaignScheduling: scheduledCampaignSchedulingReducer,
        scheduledCampaignSenderDetails: scheduledCampaignSenderDetailsReducer,
        tags: tagsReducer,
        sendingEmails: sendingEmailsReducer,
        scheduledCampaignValidations: scheduledCampaignValidationReducer,
        selectedSubscribersForDelete: selectedSubscribersForDeleteReducer,
        reloadAudienceReport: reloadAudienceReportReducer,
        subscriberDetailsDrawer: subscriberDetailsDrawerReducer,
        subscriberManagementDrawer: subscriberManagementDrawerReducer,
        autoEmailGeneralDetails: autoEmailGeneralDetailsReducer,
        autoEmailSenderDetails: autoEmailSenderDetailsReducer,
        autoEmailValidations: autoEmailValidationsReducer,
        onboarding: onboardingReducer,
        importSubscribersTransformedData: importSubscribersTransformedDataReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})