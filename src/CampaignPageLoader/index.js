import React, {useEffect, useState} from 'react'
import {types} from "../NewsLetter/sources/types";
import Newsletter from "../NewsLetter";
import ScheduledOneTime from "../ScheduledCampaign/index";
import queryString from "query-string";
import {useAuth0} from "@auth0/auth0-react";
import {Col, Row, Select} from "antd";
import {Option} from "antd/es/mentions";
import {callApi} from "../utils/apiHelper";

const CampaignPageLoader = (props) => {
    const {getAccessTokenSilently} = useAuth0();
    
    const [selectedType, setSelectedType] = useState(1);
    const [loading, setLoading] = React.useState(false)
    const [schedulingSectionDisabled, setSchedulingSectionDisabled] = React.useState(null)
    const [model, setModel] = useState(null)
    
    const campaignId = queryString.parse(props.location.search).campaignId

    const getCampaignData = async () => {
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/campaigns/getCampaign?campaignId=${campaignId}`,
            method: 'get',
            successCallback: (response) => {
                setModel(response.campaign)
                setSelectedType(response.campaign.type)
                setLoading(false)
            },
            errorCallback: (error) => {
                
            }
        })
    }

    useEffect(() => {
        if (campaignId){
            setLoading(true)
            setSchedulingSectionDisabled({pointerEvents: "none", opacity: 0.4})
            getCampaignData()
        }
    }, [props])
    
    const renderType = () => {
        switch (selectedType){
            case 0:
                return <Newsletter model={model} disableScheduling={schedulingSectionDisabled} type={selectedType} {...props} />
            case 1: 
                return <ScheduledOneTime model={model} type={selectedType} loading={loading} {...props} />
            default: 
                throw new Error("Campign type not supported")
        }
    }
    
    return <>
        <Row>
            <Col span={24}>
                <Select
                    style={{float: 'left'}}
                    onChange={setSelectedType}
                    defaultValue={selectedType}
                    disabled={campaignId}>
                    {types.map(x => <Option value={x.id}>{x.name}</Option>)}
                </Select>
            </Col>
        </Row>
        <Row>
            <Col style={{marginTop: 10}} span={24}>
                {renderType()}
            </Col>
        </Row>
    </>
}

export default CampaignPageLoader