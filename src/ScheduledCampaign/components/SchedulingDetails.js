import {Card, Col, DatePicker, Divider, Row, TimePicker} from "antd";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateSchedulingDetails} from "../../features/scheduledCampaigns/scheduledCampaignSchedulingSlice";
import moment from "moment";
import {WarningOutlined} from "@ant-design/icons";

const SchedulingDetails = (props) => {
    const dispatch = useDispatch();
    const state = useSelector(selector => selector.scheduledCampaignScheduling);
    const validations = useSelector(selector => selector.scheduledCampaignValidations);
    const {isUpdateMode} = props;
    
    return <>
        <Card style={{border: ' 1px solid #e6ebf1'}}>
            <Divider orientation="left" plain>Scheduling Details</Divider>
            <Row gutter={[16, 16]}>
                <Col span={14}>
                    <DatePicker
                        disabled={isUpdateMode}
                        status={validations.date ? '' : 'error'}
                        prefix={validations.date ? '' : <WarningOutlined />}
                        value={state.date.length ? moment(state.date) : ''}    
                        onChange={(moment, dateString) => dispatch(updateSchedulingDetails({
                        ...state,
                        date: dateString
                    }))} 
                        style={{width: '100%'}}
                        disabledDate={(current) =>current < moment().startOf('day')} />
                </Col>
                <Col span={10}>
                    <TimePicker
                        disabled={isUpdateMode}
                        status={validations.time ? '' : 'error'}
                        prefix={validations.time ? '' : <WarningOutlined />}
                        value={state.time.length ? moment(state.time) : ''}
                        onChange={(moment, timeString) => {
                            dispatch(updateSchedulingDetails({
                                ...state,
                                time: moment.toString()
                            }))
                        }}
                        style={{width: '100%'}}  />
                </Col>
            </Row>
        </Card>
    </>
}

export default SchedulingDetails;