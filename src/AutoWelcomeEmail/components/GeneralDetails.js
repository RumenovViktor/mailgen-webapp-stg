import {Card, Col, Divider, Input, Popover, Row, Space, Tooltip} from "antd";
import {InfoCircleFilled, InfoCircleOutlined, WarningOutlined} from "@ant-design/icons";
import EmailTemplateSelect from "../../components/EmailTemplateSelect";
import Tags from "../../components/Tags";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateAutoEmailGeneralDetails} from "../../features/autoEmails/autoEmailGeneralDetailsSlice";
import {useAuth0} from "@auth0/auth0-react";
import {callApi} from "../../utils/apiHelper";

const GeneralDetails = ({autoEmailId}) => {
    const dispatch = useDispatch();
    const generalDetails = useSelector(selector => selector.autoEmailGeneralDetails)
    const validations = useSelector(selector => selector.autoEmailValidations)
    const {getAccessTokenSilently} = useAuth0();
    
    const [usedTags, setUsedTags] = useState([]);
    
    useEffect(() => {
        const id = autoEmailId === null ? '' : autoEmailId;
        callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/tags/welcomeCampaign/used?autoEmailId=${id}`,
            method: 'get',
            successCallback: (response) => {
                setUsedTags(response)
            },
            errorCallback: () => { }
        })
    }, [autoEmailId])
    
    return <>
        <Card style={{border: ' 1px solid #e6ebf1'}}>
            <Divider orientation="left" plain>General Details</Divider>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Input
                        status={validations.name ? '' : 'error'}
                        prefix={validations.name ? '' : <WarningOutlined />}
                        onChange={(event) => {
                            dispatch(updateAutoEmailGeneralDetails({
                                ...generalDetails,
                                name: event.target.value
                            }))
                        }}
                        value={generalDetails.name}
                        placeholder="Name" />
                </Col>
                <Col span={6}>
                    <EmailTemplateSelect
                        disabled={false}
                        valid={validations.emailTemplateId}
                        value={generalDetails.emailTemplateId}
                        handler={val => {
                            dispatch(updateAutoEmailGeneralDetails({
                                ...generalDetails,
                                emailTemplateId: val
                            }))
                        }}/>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{marginTop: 10}}>
                <Col span={6}>
                    <Tags disabledTags={usedTags} status={validations.tags ? '' : 'error'} />
                </Col>
                <Col>
                    <Tooltip title="Some tags may be disabled. This means they were already used in another Automatic Email Template.">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Col>
            </Row>
        </Card>
    </>
}

export default GeneralDetails;