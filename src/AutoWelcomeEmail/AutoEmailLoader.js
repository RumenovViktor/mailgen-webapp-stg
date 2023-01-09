import React, {useEffect, useState} from "react"
import AutoWelcomeEmail from "../AutoWelcomeEmail";
import {useAuth0} from "@auth0/auth0-react";
import queryString from "query-string";
import {Col, Row, Select} from "antd";
import {callApi} from "../utils/apiHelper";

const AutoEmailTypes = Object.freeze([{
    id: 0,
    name: 'Welcome Email'
}])

const AutoEmailLoader = (props) => {
    const {getAccessTokenSilently} = useAuth0();

    const autoEmailId = queryString.parse(props.location.search).autoEmailId;
    const [selectedType, setSelectedType] = useState(0)
    const [model, setModel] = useState(null)
    const [loading, setLoading] = useState(false)

    const getAutoEmailData = async () => {
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/automation/getAutoWelcomeEmail?id=${autoEmailId}`,
            method: 'get',
            successCallback: (response) => {
                setModel(response.autoEmail)
                setSelectedType(response.autoEmail.type)
                setLoading(false)
            },
            errorCallback: () => {}
        })
    }

    useEffect(() => {
        if (autoEmailId) {
            setLoading(true)
            getAutoEmailData()
        }
    }, [props])

    const getPageForLoad = () => <AutoWelcomeEmail loading={loading} model={model} type={selectedType}/>;

    return <>
        <Row>
            <Col span={24}>
                <Select
                    style={{float: 'left'}}
                    onChange={setSelectedType}
                    defaultValue={selectedType}
                    disabled={autoEmailId}>
                    {AutoEmailTypes.map(x => <Select.Option value={x.id}>{x.name}</Select.Option>)}
                </Select>
            </Col>
        </Row>
        <Row>
            <Col style={{marginTop: 10}} span={24}>
                {getPageForLoad()}
            </Col>
        </Row>
    </>
}

export default AutoEmailLoader