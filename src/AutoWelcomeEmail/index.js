import React, {useEffect} from "react"
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from "react-router-dom";
import validateEmail from "../utils/ValueValidations";
import {Button, Col, Row} from "antd";
import GeneralDetails from "./components/GeneralDetails";
import SenderDetails from "./components/SenderDetails";
import {callApi} from "../utils/apiHelper";
import {useDispatch, useSelector} from "react-redux";
import {updateAutoEmailGeneralDetails} from "../features/autoEmails/autoEmailGeneralDetailsSlice";
import {updateAutoEmailSenderDetails} from "../features/autoEmails/autoEmailSenderDetailsSlice";
import {updateSelectedTags} from "../features/tagsSlice";
import {stringNotNull} from "../ScheduledCampaign/logic/scheduledCampaignsValidations";
import {updateAutoEmailValidation} from "../features/autoEmails/autoEmailValidationsSlice";
import {updateSendingEmails} from "../features/sendingEmailsSlice";

const AutoWelcomeEmail = (props) => {

    const {type, model} = props
    const {getAccessTokenSilently} = useAuth0();
    const history = useHistory()
    
    const dispatch = useDispatch();
    const generalDetailsState = useSelector(x => x.autoEmailGeneralDetails);
    const senderDetailsState = useSelector(x => x.autoEmailSenderDetails);
    const tagsState = useSelector(x => x.tags);
    const sendingEmailId = useSelector(x => x.sendingEmails);

    const areFieldsValid = () => {
        let validationResult = {
            name: true,
            emailTemplateId: true,
            subject: true,
            senderName: true,
            tags: true
        };

        if (!stringNotNull(generalDetailsState.name)){
            validationResult.name = false;
        }

        if (!stringNotNull(generalDetailsState.emailTemplateId)){
            validationResult.emailTemplateId = false;
        }

        if (!stringNotNull(senderDetailsState.subject)){
            validationResult.subject = false;
        }

        if (tagsState.length <= 0){
            validationResult.tags = false;
        }

        dispatch(updateAutoEmailValidation(validationResult))
        return !Object.values(validationResult).some(x => x == false);
    }
    
    const upsert = async () => {
        if (!areFieldsValid()){
            return;
        }
        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/automation/upsertAutoWelcomeEmail`,
            method: 'post',
            request: {
                ...generalDetailsState,
                ...senderDetailsState,
                id: model ? model.id : null,
                type: type,
                tags: tagsState,
                replyToSendingEmailId: sendingEmailId
            },
            successCallback: () => {
                history.push('/auto-emails')
            }
        })
    }
    
    useEffect(() => {
        if(model) {
            dispatch(updateAutoEmailGeneralDetails({
                name: model.name,
                emailTemplateId: model.emailTemplateId,
            }))

            dispatch(updateAutoEmailSenderDetails({
                subject: model.subject,
                senderName: model.senderName,
                senderEmail: model.senderEmail
            }))
            
            dispatch(updateSelectedTags(model.tags))
            dispatch(updateSendingEmails(model.sendingEmail !== null ? model.sendingEmail.id : null));
        }
    }, [model])

    return <>
            <Row>
                <Col span={24}>
                    <GeneralDetails autoEmailId={model ? model.id : null} />
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>
                    <SenderDetails />
                </Col>
            </Row>
        <Row style={{marginTop: 10}}>
            <Col>
                <Button type="primary" loading={false} onClick={async () => { await upsert() }}>
                    Save
                </Button>
            </Col>
        </Row>
    </>
}

export default AutoWelcomeEmail