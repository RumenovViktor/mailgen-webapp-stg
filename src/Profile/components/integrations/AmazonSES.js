import React, {useEffect, useState} from 'react'
import {useAuth0} from "@auth0/auth0-react";
import {Alert, Button, Col, Input, Row, Select, Spin} from "antd";
import {callApi} from "../../../utils/apiHelper";

const AmazonSES = () => {
    const [regions, setRegions] = useState([])
    const [loading, setLoading] = useState({
        integrations: false,
        regions: false,
        saveButton: false
    });
    const [data, setData] = useState({
        region: '',
        publicKey: '',
        privateKey: ''
    })

    const {getAccessTokenSilently} = useAuth0();

    const save = async () => {
        setLoading({
            ...loading,
            saveButton: true
        })
        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/integrations/add/amazonses`,
            method: 'post',
            request: {
                amazonSes: data
            },
            successCallback: (response) => {
                setLoading({
                    ...loading,
                    saveButton: false
                })
            },
            errorCallback: (error) => {
                console.log(error)
            }
        })
    }

    const getRegions = () => {
        setLoading({
            ...loading,
            integrations: true
        })
        callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/integrations/get/regions`,
            method: 'get',
            successCallback: (response) => {
                setLoading({
                    ...loading,
                    integrations: false
                })
                setRegions(response)
            },
            errorCallback: (error) => {
                console.log(error)
            }
        })
    }

    const getIntegrations = () => {
        setLoading({
            ...loading,
            regions: true
        })
        callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/integrations`,
            method: 'get',
            successCallback: (response) => {
                setLoading({
                    ...loading,
                    regions: false
                })
                setData({
                    region: response.amazonSes.region,
                    privateKey: response.amazonSes.privateKey,
                    publicKey: response.amazonSes.publicKey
                })
            },
            errorCallback: (error) => {
                console.log(error)
            }
        })
    }

    useEffect(() => {
        getRegions();
        getIntegrations();
    }, [])

    return <>
        <Spin spinning={loading.integrations || loading.regions}>
            <Row>
                <Col span={12}>
                    <Alert
                        message={"Your credentials will always be encrypted in our database. Sign up for a Amazon account and configure Amazon SES by validating your domain and requesting production access."}/>
                </Col>
            </Row>
            <Row style={{marginTop: 10}} gutter={[16, 16]}>
                <Col span={1}>
                    <Select
                        style={{width: 200}}
                        onChange={x => setData({...data, region: x})}
                        value={data.region}
                        placeholder="Select a Region...">
                        {regions.map(x => {
                            return <Select.Option value={x.id}>{x.displayName}</Select.Option>
                        })}
                    </Select>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{marginTop: 10}}>
                <Col span={8}>
                    <Input
                        value={data.publicKey}
                        placeholder="AWS Access Key"
                        onChange={x => setData({...data, publicKey: x.target.value})}/>
                </Col>
                <Col span={8}>
                    <Input.Password
                        value={data.privateKey}
                        placeholder="AWS Private Key"
                        onChange={x => setData({...data, privateKey: x.target.value})}/>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col>
                    <Button loading={loading.saveButton} onClick={save} type='primary'>Save</Button>
                </Col>
            </Row>
        </Spin>
    </>
}

export default AmazonSES