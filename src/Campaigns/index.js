import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Col, Row, Table} from "antd";
import {ContainerWrapper, ReportTitle} from "../reportComponents/CampaignStyles";
import {getCampaignColumns} from "./logic/columns";
import {callApi} from "../utils/apiHelper";
import {PlusOutlined} from "@ant-design/icons";

const CampaignsReport = () => {
    const [loading, setLoading] = useState(false)
    const [campaigns, setCampaigns] = useState([])
    const history = useHistory()
    const {getAccessTokenSilently} = useAuth0();

    const getCampaigns = async () => {
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/campaigns/getCampaigns`,
            method: 'get',
            successCallback: (response) => {
                setCampaigns(response.campaigns)
                setLoading(false)
            },
            errorCallback: () => {}
        })
    }

    useEffect(() => {
        setLoading(true)
        getCampaigns()
    }, [])

    const openCampaignCreation = () => {
        history.push('/campaign')
    }

    const openCampaignUpdate = (id) => {
        history.push({
            pathname: '/campaign',
            search: `?mode=update&campaignId=${id}`,
            state: null
        })
    }

    return <>
        <Row gutter={[16, 24]} style={{marginTop: 20}}>
            <Col span={24}>
                <div>
                    <ContainerWrapper>
                        <Row gutter={[16, 16]}>
                            <Col span={2}>
                                <ReportTitle>Campaigns</ReportTitle>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={2}>
                                <Button icon={<PlusOutlined />} onClick={openCampaignCreation}>Create Campaign</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table
                                    loading={loading}
                                    columns={getCampaignColumns((id) => openCampaignUpdate(id))}
                                    dataSource={campaigns}
                                />
                            </Col>
                        </Row>
                    </ContainerWrapper>
                </div>
            </Col>
        </Row>
    </>
}

export default CampaignsReport