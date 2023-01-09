import * as React from 'react'
import {Button, Col, Drawer, Input, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import Tags from "../../components/Tags";
import {callApi} from "../../utils/apiHelper";
import {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import validateEmail from "../../utils/ValueValidations";
import {setSubscriberManagementDrawerState} from "../../features/subscribers/subscriberManagementDrawerSlice";
import EmailTemplateSelect from "../../components/EmailTemplateSelect";
import SendingEmail from "../../components/SendingEmail";

const SendEmailsByTags = () => {
    const dispatch = useDispatch()
    const state = useSelector(selector => selector.subscriberManagementDrawer)
    const tagsState = useSelector(selector => selector.tags)
    const sendingEmailState = useSelector(selector => selector.sendingEmails)
    const {getAccessTokenSilently} = useAuth0();
    const [loading, setLoading] = useState(false)
    const [model, setModel] = useState({
        subject: '',
        senderName: '',
        senderEmail: '',
        emailTemplateId: null,
    })
    const [validations, setValidations] = useState({
        subject: true,
        senderEmail: true,
        emailTemplateId: true,
        tags: true
    })

    const onClose = () => {
        dispatch(setSubscriberManagementDrawerState({
            ...state,
            sendEmailsByTags: false
        }))
    }

    const areFieldsValid = () => {
        let currentValidationResult = {
            subject: true,
            senderEmail: true,
            emailTemplateId: true,
            tags: true
        };

        if (!model.subject || model.subject.length < 3) {
            currentValidationResult.subject = false;
        }

        if (!model.emailTemplateId || model.emailTemplateId.length < 3) {
            currentValidationResult.emailTemplateId = false;
        }
        
        if (tagsState.length <= 0){
            currentValidationResult.tags = false;
        }

        setValidations(currentValidationResult)
        return !Object.values(currentValidationResult).some(x => x == false);
    }

    const onUpdate = async () => {
        debugger
        if (!areFieldsValid()) {
            return;
        }
        
        setLoading(true)
        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/emails/sendMassEmails`,
            method: 'post',
            request: {
                subject: model.subject,
                senderEmail: model.senderEmail,
                replyToSendingEmail: sendingEmailState,
                senderName: model.senderName,
                emailTemplateId: model.emailTemplateId,
                tags: tagsState
            },
            successCallback: () => {
                setLoading(false)
                onClose()
            },
            errorCallback: (err) => {
                setLoading(false)
            }
        })
    }

    return (
        <>
            <Drawer width="900" title="Send Emails By Tags" placement="right" onClose={onClose} visible={state.sendEmailsByTags}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Input
                            status={validations.subject ? '': 'error'}
                            onChange={event => setModel({
                                ...model,
                                subject: event.target.value
                            })}
                            value={model.subject} placeholder="Subject"/>
                    </Col>
                </Row>
                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                    <Col span={12}>
                        <Input
                            onChange={event => setModel({
                                ...model,
                                senderName: event.target.value
                            })}
                            value={model.senderName} placeholder="Sender Name"/>
                    </Col>
                    <Col span={12}>
                        <SendingEmail />
                    </Col>
                </Row>
                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                    <Col span={24}>
                        <EmailTemplateSelect
                            disabled={false}
                            valid={validations.emailTemplateId}
                            value={model.emailTemplateId}
                            handler={val => {
                                setModel({
                                    ...model,
                                    emailTemplateId: val
                                })
                            }}/>
                    </Col>
                </Row>
                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                    <Col span={24}>
                        <Tags status={validations.tags ? '' : 'error'} />
                    </Col>
                </Row>
                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                    <Col span={24}>
                        <Button
                            onClick={onUpdate}
                            style={{float: 'right'}}
                            type="primary"
                            loading={loading}>Send</Button>
                    </Col>
                </Row>
            </Drawer>
        </>
    );
}

export default SendEmailsByTags