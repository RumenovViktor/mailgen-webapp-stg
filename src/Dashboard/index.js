import React, {useEffect, useState} from "react"
import useStyles from "./styles";
import CampaignsReport from "./components/CampaignsReport";
import AutoEmailsDashboardReport from "./components/AutoEmailsDashboardReport";
import DateRangePicker from "../components/DateRangePicker";
import CustomNumber from "../utils/CustomNumber";
import NumberFormatter from "../utils/NumberFormatter";
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../config";
import moment from "moment";
import {Card, Col, Row, Statistic} from "antd";
import {AnalyticsTitle, ContainerWrapper} from "../reportComponents/CampaignStyles";

const Dashboard = () => {
    const styles = useStyles();
    const [counts, setCounts] = useState({activeCampaigns: 0, audienceSize: 0})
    const [analytics, setAnalytics] = useState({campaignsDetails: [], autoEmailsDetails: []})
    const [loadingRange, setLoadingRange] = useState(false)
    const [loadingCounts, setLoadingCounts] = useState(false)
    const [dateRange, setDateRange] = useState({
        range: {
            from: null,
            to: null
        },
        valid: true
    })
    const {getAccessTokenSilently} = useAuth0();

    const config = getConfig()

    const getCounts = async () => {
        setLoadingCounts(true)
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });

        fetch(`${process.env.REACT_APP_API_BASE}/dashboard/GetDashboardCounts`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(response => {
                setCounts({activeCampaigns: response.activeCampaigns, audienceSize: response.audienceSize})
                setLoadingCounts(false)
            })
            .catch(x => console.log(x.message))
    }

    const getActivity = async () => {
        if (!dateRange.valid)
            return

        setLoadingRange(true)
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });

        const from = moment(dateRange.range.from).utc().format()
        const to = moment(dateRange.range.to).utc().format()

        fetch(`${process.env.REACT_APP_API_BASE}/dashboard/GetActivity?from=${from}&to=${to}`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(response => {
                setAnalytics({
                    campaignsDetails: response.campaignsDetails,
                    autoEmailsDetails: response.autoEmailsDetails
                })
                setLoadingRange(false)
            })
            .catch(x => console.log(x.message))
    }

    useEffect(() => {
        getCounts()
    }, [])

    useEffect(() => {
        if (dateRange.range.from && dateRange.range.to) {
            getActivity()
        }

    }, [dateRange])

    return <>
        <Row gutter={[16, 24]}>
            <Col span={12}>
                <ContainerWrapper>
                    <Card style={{border: 'none'}}>
                        <Statistic
                            title={<AnalyticsTitle>Active Campaigns</AnalyticsTitle>}
                            value={counts.activeCampaigns}
                            loading={loadingCounts}/>
                    </Card>
                </ContainerWrapper>
            </Col>
            <Col span={12}>
                <ContainerWrapper>
                    <Card style={{border: 'none'}}>
                        <Statistic
                            title={<AnalyticsTitle>Audience Size</AnalyticsTitle>}
                            value={new CustomNumber(counts.audienceSize, new NumberFormatter()).Value}
                            loading={loadingCounts}/>
                    </Card>
                </ContainerWrapper>
            </Col>
            <Col span={8}>
                <DateRangePicker value={dateRange} handler={setDateRange}/>
            </Col>
        </Row>
        <Row justify={"start"} gutter={[16, 24]} style={{marginTop: 20}}>
            <Col span={24}>
                <div>
                    <CampaignsReport loading={loadingRange} rows={analytics.campaignsDetails}/>
                </div>
            </Col>
        </Row>
        <Row justify={"start"} gutter={[16, 24]} style={{marginTop: 10}}>
            <Col span={24}>
                <div>
                    <AutoEmailsDashboardReport loading={loadingRange} rows={analytics.autoEmailsDetails}/>
                </div>
            </Col>
        </Row>
    </>
}

export default Dashboard