import {Card, Col, Divider, Input, Row} from "antd";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {WarningOutlined} from "@ant-design/icons";
import {updateAutoEmailSenderDetails} from "../../features/autoEmails/autoEmailSenderDetailsSlice";
import SendingEmail from "../../components/SendingEmail";

const SenderDetails = (props) => {
    const dispatch = useDispatch();
    const state = useSelector(selector => selector.autoEmailSenderDetails);
    const validations = useSelector(selector => selector.autoEmailValidations);
    const {isUpdateMode} = props;
    
    const dispatchSubject = (newVal) => {
        dispatch(updateAutoEmailSenderDetails({
            ...state,
            subject: newVal
        }))
    }

    const dispatchSenderName = (newVal) => {
        dispatch(updateAutoEmailSenderDetails({
            ...state,
            senderName: newVal
        }))
    }

    const dispatchSenderEmail = (newVal) => {
        dispatch(updateAutoEmailSenderDetails({
            ...state,
            senderEmail: newVal
        }))
    }
    
    return <>
        <Card style={{border: ' 1px solid #e6ebf1'}}>
            <Divider orientation="left" plain>Sender Details</Divider>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Input
                        disabled={isUpdateMode}
                        status={validations.subject ? '' : 'error'}
                        prefix={validations.subject ? '' : <WarningOutlined />}
                        onChange={(event) => dispatchSubject(event.target.value)}
                        value={state.subject} 
                        placeholder="Subject" />
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{marginTop: 10}}>
                <Col span={6}>
                    <Input
                        disabled={isUpdateMode}
                        onChange={(event) => dispatchSenderName(event.target.value)}
                        value={state.senderName} 
                        placeholder="Sender Name" />
                </Col>
                <Col span={6}>
                    {/*<Input*/}
                    {/*    disabled={isUpdateMode}*/}
                    {/*    status={validations.senderEmail ? '' : 'error'}*/}
                    {/*    prefix={validations.senderEmail ? '' : <WarningOutlined />}*/}
                    {/*    onChange={(event) => dispatchSenderEmail(event.target.value)}*/}
                    {/*    value={state.senderEmail} */}
                    {/*    placeholder="Sender Email" />*/}
                    <SendingEmail disabled={isUpdateMode} />
                </Col>
            </Row>
        </Card>    
    </>
}

export default SenderDetails;