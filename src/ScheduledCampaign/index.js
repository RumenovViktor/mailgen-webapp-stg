import React, {useEffect, useState} from 'react'
import queryString from "query-string";
import {useHistory} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Col, notification, Row, Spin} from "antd";
import GeneralDetails from "./components/GeneralDetails";
import SchedulingDetails from "./components/SchedulingDetails";
import SenderDetails from "./components/SenderDetails";
import {useDispatch, useSelector} from "react-redux";
import moment from 'moment';
import {resetGeneralDetails, updateGeneralDetails} from "../features/scheduledCampaigns/scheduledCampaignGeneralSlice";
import {
    resetSenderDetails,
    updateSenderDetails
} from "../features/scheduledCampaigns/scheduledCampaignSenderDetailsSlice";
import {
    resetSchedulingDetails,
    updateSchedulingDetails
} from "../features/scheduledCampaigns/scheduledCampaignSchedulingSlice";
import {resetSelectedTags, updateSelectedTags} from "../features/tagsSlice";
import {getGeneralDetailsModel, getSchedulingDetails, getSenderDetailsModel} from "./logic/modelBuilder";
import {callApi} from "../utils/apiHelper";
import {
    stringNotNull,
    validateStringLength
} from "./logic/scheduledCampaignsValidations";
import {updateScheduledCampaignValidation} from "../features/scheduledCampaigns/validationSlice";
import {resetSendingEmails, updateSendingEmails} from "../features/sendingEmailsSlice";

const ScheduledOneTime = (props) => {
    const history = useHistory()
    const {getAccessTokenSilently} = useAuth0();
    const dispatch = useDispatch();
    const general = useSelector(selector => selector.scheduledCampaignGeneral);
    const scheduling = useSelector(selector => selector.scheduledCampaignScheduling);
    const senderDetails = useSelector(selector => selector.scheduledCampaignSenderDetails);
    const tags = useSelector(selector => selector.tags);
    const sendingEmailId = useSelector(selector => selector.sendingEmails);
    const {loading} = props;
    const {type, model} = props

    const campaignId = queryString.parse(props.location.search).campaignId
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    
    const areFieldsValid = () => {
        let validationResult = {
            name: true,
            emailTemplateId: true,
            enableOpenRate: true,
            enableClickTracking: true,
            date: true,
            time: true,
            subject: true,
            tags: true
        };
        
        if (!validateStringLength(general.name)){
            validationResult.name = false;
        }

        if (!stringNotNull(general.emailTemplateId)){
            validationResult.emailTemplateId = false;
        }

        if (!stringNotNull(scheduling.date)){
            validationResult.date = false;
        }

        if (!stringNotNull(scheduling.time)){
            validationResult.time = false;
        }
        if (!validateStringLength(senderDetails.subject)){
            validationResult.subject = false;
        }

        if (tags.length <= 0){
            validationResult.tags = false;
        }
        
        dispatch(updateScheduledCampaignValidation(validationResult))
        return !Object.values(validationResult).some(x => x == false);
    }

    const openNotificationWithIcon = (type, data) => {
        notification[type]({
            message: data.title,
            description: data.text
        });
    };

    const upsert = async () => {
        debugger
        setButtonDisabled(true)
        
        if (!areFieldsValid()){
            setButtonDisabled(false)
            return;
        }
        
        const momentDate = moment(scheduling.date);
        const momentTime = moment(scheduling.time);
        
        const request = {
            ...general,
            ...scheduling,
            ...senderDetails,
            tags: [...tags],
            replyToSendingEmailId: sendingEmailId,
            repeatType: 3,
            type: type,
            campaignId: campaignId,
            repeatTime: new Date(momentDate.year(), momentDate.month(), momentDate.date(), momentTime.hours(), momentTime.minutes(), 0)
        }

        await callApi(getAccessTokenSilently,
            {
                url: `${process.env.REACT_APP_API_BASE}/campaigns/upsertCampaign`,
                method: 'POST',
                request: request,
                successCallback: (response) => {
                    setButtonDisabled(false)
                    history.push('/campaigns')
                    if (response.isSuccess){
                        openNotificationWithIcon('success', {
                            title: 'Campaign created successfully',
                            text: 'You campaign is created and started automatically!'
                        })
                    }else{
                        openNotificationWithIcon('error',{
                            title: 'Error white processing your action',
                            text: 'Something went wrong. Please try again later!'
                        })
                    }
                },
                errorCallback: () => {
                    openNotificationWithIcon('error',{
                        title: 'Error white processing your action',
                        text: 'Something went wrong. Please try again later!'
                    })
                }
            })
    }

    useEffect(() => {
        if (campaignId && model) {
            dispatch(updateGeneralDetails(getGeneralDetailsModel(model)))
            dispatch(updateSenderDetails(getSenderDetailsModel(model)))
            dispatch(updateSchedulingDetails(getSchedulingDetails(model)))
            dispatch(updateSelectedTags(model.tags))
            dispatch(updateSendingEmails(model.replyToSendingEmail ? model.replyToSendingEmail.id : null))
            setIsUpdateMode(true)
        }else {
            dispatch(resetGeneralDetails())
            dispatch(resetSchedulingDetails())
            dispatch(resetSenderDetails())
            dispatch(resetSelectedTags())
            dispatch(resetSendingEmails())
        }
    }, [model])

    return <>
        <Spin spinning={loading}>
            <Row justify={"start"} gutter={[16, 16]}>
                <Col span={12}>
                    <GeneralDetails isUpdateMode={isUpdateMode} />
                </Col>
                <Col span={12}>
                    <SchedulingDetails isUpdateMode={isUpdateMode} />
                </Col>
            </Row>
            <Row style={{marginTop: 15}} justify={"start"} gutter={[16, 16]}>
                <Col span={12}>
                    <SenderDetails isUpdateMode={isUpdateMode} />
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col>
                    <Button type="primary" loading={buttonDisabled} onClick={async () => { await upsert() }}>
                        Save
                    </Button>
                </Col>
            </Row>
        </Spin>
    </>
}

export default ScheduledOneTime