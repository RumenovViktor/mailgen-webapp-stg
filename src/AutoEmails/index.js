import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Col, Row, Table} from "antd";
import {ContainerWrapper, ReportTitle} from "../reportComponents/CampaignStyles";
import {getAutoEmailsReportColumns} from "./logic/columns";
import {PlusOutlined} from "@ant-design/icons";
import {callApi} from "../utils/apiHelper";
import {useDispatch} from "react-redux";
import {resetAutoEmailGeneralDetails} from "../features/autoEmails/autoEmailGeneralDetailsSlice";
import {resetAutoEmailSenderDetails} from "../features/autoEmails/autoEmailSenderDetailsSlice";
import {resetSelectedTags} from "../features/tagsSlice";
import {resetAutoEmailValidations} from "../features/autoEmails/autoEmailValidationsSlice";

const AutomationsReport = () => {
    const [loading, setLoading] = useState(false)
    const [autoEmails, setAutoEmails] = useState([])
    const history = useHistory()
    const {getAccessTokenSilently} = useAuth0();
    const dispatch = useDispatch();

    const getAutoEmails = async () => {
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/automation/getAutoEmailsReport`,
            method: 'get',
            successCallback: (response) => {
                setAutoEmails(response.autoEmails)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        setLoading(true)
        getAutoEmails()
    }, [])

    const openAutoEmailCreation = () => {
        dispatch(resetAutoEmailGeneralDetails())
        dispatch(resetAutoEmailSenderDetails())
        dispatch(resetSelectedTags())
        dispatch(resetAutoEmailValidations())
        history.push('/auto-email')
    }

    const openAutoEmailUpdate = (id) => {
        history.push({
            pathname: '/auto-email',
            search: `?mode=update&autoEmailId=${id}`,
            state: null
        })
    }

    return <>
        <Row gutter={[16, 24]} style={{marginTop: 20}}>
            <Col span={24}>
                <div>
                    <ContainerWrapper>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <ReportTitle>Automated Emails</ReportTitle>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={2}>
                                <Button icon={<PlusOutlined />} onClick={openAutoEmailCreation}>Create</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table
                                    loading={loading}
                                    columns={getAutoEmailsReportColumns((id) => openAutoEmailUpdate(id))}
                                    dataSource={autoEmails}
                                />
                            </Col>
                        </Row>
                    </ContainerWrapper>
                </div>
            </Col>
        </Row>
    </>
}

export default AutomationsReport