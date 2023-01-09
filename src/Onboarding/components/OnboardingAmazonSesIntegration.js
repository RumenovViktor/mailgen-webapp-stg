import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {callApi} from "../../utils/apiHelper";
import {Alert, Col, Input, Row, Select, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {updateOnboarding} from "../../features/onboarding/onboardingSlice";

const OnboardingAmazonSesIntegration = () => {
    const state = useSelector(x => x.onboarding)
    const dispatch = useDispatch()

    const [regions, setRegions] = useState([])
    const [loading, setLoading] = useState({
        regions: false
    });

    const {getAccessTokenSilently} = useAuth0();

    const getRegions = async () => {
        setLoading({
            ...loading,
            regions: true
        })
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/integrations/get/regions`,
            method: 'get',
            successCallback: (response) => {
                setLoading({
                    ...loading,
                    regions: false
                })
                setRegions(response)
            },
            errorCallback: (error) => {
                console.log(error)
            }
        })
    }

    useEffect(() => {
        getRegions();
    }, [])

    return <>
        <Row>
            <Col span={12}>
                <Alert
                    message={"Your credentials will always be encrypted in our database. Sign up for a Amazon account and configure Amazon SES by validating your domain and requesting production access."}/>
            </Col>
        </Row>
        <Row style={{marginTop: 10}} gutter={[16, 16]}>
            <Col span={1}>
                <Select
                    loading={loading.regions}
                    style={{width: 200}}
                    onChange={x => {
                        dispatch(updateOnboarding({
                            ...state,
                            amazonSesIntegration: {
                                ...state.amazonSesIntegration,
                                region: x
                            }
                        }))
                    }}
                    value={state.amazonSesIntegration.region}
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
                    value={state.amazonSesIntegration.publicKey}
                    placeholder="AWS Access Key"
                    onChange={x => {
                        dispatch(updateOnboarding({
                            ...state,
                            amazonSesIntegration: {
                                ...state.amazonSesIntegration,
                                publicKey: x.target.value
                            }
                        }))
                    }
                    }/>
            </Col>
            <Col span={8}>
                <Input.Password
                    value={state.amazonSesIntegration.privateKey}
                    placeholder="AWS Private Key"
                    onChange={x => {
                        dispatch(updateOnboarding({
                            ...state,
                            amazonSesIntegration: {
                                ...state.amazonSesIntegration,
                                privateKey: x.target.value
                            }
                        }))
                    }
                    }/>
            </Col>
        </Row>
    </>
}

export default OnboardingAmazonSesIntegration;