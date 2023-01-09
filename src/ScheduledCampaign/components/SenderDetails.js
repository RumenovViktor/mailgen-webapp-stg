import {Card, Col, Divider, Input, Row} from "antd";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateSenderDetails} from "../../features/scheduledCampaigns/scheduledCampaignSenderDetailsSlice";
import {WarningOutlined} from "@ant-design/icons";
import SendingEmail from "../../components/SendingEmail";

const SenderDetails = (props) => {
    const dispatch = useDispatch();
    const state = useSelector(selector => selector.scheduledCampaignSenderDetails);
    const validations = useSelector(selector => selector.scheduledCampaignValidations);
    const {isUpdateMode} = props;
    
    const dispatchSubject = (newVal) => {
        dispatch(updateSenderDetails({
            ...state,
            subject: newVal
        }))
    }

    const dispatchSenderName = (newVal) => {
        dispatch(updateSenderDetails({
            ...state,
            senderName: newVal
        }))
    }
    
    return <>
        <Card style={{border: ' 1px solid #e6ebf1'}}>
            <Divider orientation="left" plain>Sender Details</Divider>
            <Row gutter={[16, 16]}>
                <Col span={10}>
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
                <Col span={10}>
                    <Input
                        disabled={isUpdateMode}
                        onChange={(event) => dispatchSenderName(event.target.value)}
                        value={state.senderName} 
                        placeholder="Sender Name" />
                </Col>
                <Col span={14}>
                    <SendingEmail disabled={isUpdateMode} />
                </Col>
            </Row>
        </Card>    
    </>
}

export default SenderDetails;