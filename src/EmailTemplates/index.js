import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {getConfig} from "../config";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Col, Row, Table} from "antd";
import {ContainerWrapper, ReportTitle} from "../reportComponents/CampaignStyles";
import {PlusOutlined} from "@ant-design/icons";
import {getTemplatesReportColumns} from "./logic/columns";
import EmailTemplateSelect from "./components/EmailTemplateSelect";

const EmailTemplatesReport = () => {
    const [loading, setLoading] = useState(false)
    const [emailTemplates, setEmailTemplates] = useState([])
    const {getAccessTokenSilently} = useAuth0();

    const history = useHistory()
    const config = getConfig()

    // TODO: refactor it as a hook somehow
    const callApi = async () => {
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });

        fetch(`${process.env.REACT_APP_API_BASE}/emailTemplates/getTemplates`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
            .then(res => res.json())
            .then(response => {
                setEmailTemplates(response.templates)
                setLoading(false)
            })
            .catch(x => console.log(x.message))
    }

    useEffect(() => {
        setLoading(true)
        callApi()
    }, [])

    const openEmailTemplateUpdate = (id, templateType) => {
        history.push({
            pathname: templateType === 0 ? '/simple-template' : 'drag-and-drop',
            search: `?id=${id}`,
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
                                <ReportTitle>Email Templates</ReportTitle>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={2}>
                                <EmailTemplateSelect />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table
                                    loading={loading}
                                    columns={getTemplatesReportColumns((id, templateType) => openEmailTemplateUpdate(id, templateType))}
                                    dataSource={emailTemplates}
                                />
                            </Col>
                        </Row>
                    </ContainerWrapper>
                </div>
            </Col>
        </Row>
    </>
}

export default EmailTemplatesReport