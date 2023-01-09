import React from "react";
import {Card, Checkbox, Col, Divider, Input, Row, Tooltip} from "antd";
import EmailTemplateSelect from "../../components/EmailTemplateSelect";
import Tags from "../../components/Tags";
import {useDispatch, useSelector} from "react-redux";
import {updateGeneralDetails} from '../../features/scheduledCampaigns/scheduledCampaignGeneralSlice'
import {WarningOutlined} from "@ant-design/icons";

const GeneralDetails = (props) => {
    const dispatch = useDispatch();
    const selector = useSelector(selector => selector.scheduledCampaignGeneral)
    const validations = useSelector(selector => selector.scheduledCampaignValidations)
    const {isUpdateMode} = props;
    
    return <>
        <Card style={{border: ' 1px solid #e6ebf1'}}>
            <Divider orientation="left" plain>General Details</Divider>
            <Row gutter={[16, 16]}>
                <Col span={14}>
                    <Input
                        status={validations.name ? '' : 'error'}
                        prefix={validations.name ? '' : <WarningOutlined />}
                        onChange={(event) => {
                            dispatch(updateGeneralDetails({
                                ...selector,
                                name: event.target.value
                            }))
                        }}
                        value={selector.name} 
                        placeholder="Name" />
                </Col>
                <Col span={10}>
                    <EmailTemplateSelect
                        disabled={false}
                        valid={validations.emailTemplateId}
                        value={selector.emailTemplateId}
                        handler={val => {
                            dispatch(updateGeneralDetails({
                                ...selector,
                                emailTemplateId: val
                            }))
                        }}/>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col>
                    <Tooltip title="This option enables you to see the rate of the emails that were opened.">
                        <Checkbox
                            disabled={isUpdateMode}
                            defaultChecked={selector.enableOpenRate}
                            onChange={event => {
                                dispatch(updateGeneralDetails({
                                    ...selector,
                                    enableOpenRate: event.target.checked
                                }))
                            }}>Enable open rates</Checkbox>
                    </Tooltip>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col>
                    <Tooltip title="This option enables you to track the link clicks in your emails.">
                        <Checkbox
                            disabled={isUpdateMode}
                            defaultChecked={selector.enableClickTracking}
                            onChange={event => {
                                dispatch(updateGeneralDetails({
                                    ...selector,
                                    enableClickTracking: event.target.checked
                                }))
                            }}>
                            Enable click tracking
                        </Checkbox>
                    </Tooltip>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{marginTop: 10}}>
                <Col span={10}>
                    <Tags status={validations.tags ? '' : 'error'} />
                </Col>
            </Row>
        </Card>
    </>
}

export default GeneralDetails;