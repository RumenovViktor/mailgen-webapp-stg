import * as React from 'react'
import {Alert, Button, Col, Drawer, Input, Row, Select, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {updateSubscriberDetailsDrawer} from "../../features/subscribers/subscriberDetailsDrawer";
import Tags from "../../components/Tags";
import {callApi} from "../../utils/apiHelper";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {formatDate} from "../../utils/dateFormatter";
import {updateSelectedTags} from "../../features/tagsSlice";
import {setShouldReload} from "../../features/subscribers/reloadAudienceReportSlice";
import moment from "moment";
import validateEmail from "../../utils/ValueValidations";

const subscriberType = Object.freeze({
    NotSubscribed: 0,
    Subscribed: 1
})

const subscriberTypeOptions = Object.freeze([{
    id: subscriberType.Subscribed,
    name: "Subscribed"
}, {
    id: subscriberType.NotSubscribed,
    name: "Not Subscribed"
}])

const WarningMessageContainer = ({bounceStatus, reason}) => {
    const WarningMessage = () => {
        return <>
            <div>
                <span>Message delivery failed for this subscriber:</span>
            </div>
            <div>
                <span style={{fontWeight: 'bold'}}>{reason}</span>
            </div>
        </>
    }

    const ErrorMessage = () => {
        return <>
            <div>
                <span>Message delivery failed for this subscriber, you will not be able to send new messages to this subscriber, as this indicates that the email address simply does not exist:</span>
            </div>
            <div>
                <span style={{fontWeight: 'bold'}}>{reason}</span>
            </div>
        </>
    }
    const getContainer = () => {
        if (bounceStatus === 1){
            return <Alert
                message={<span style={{fontWeight: 'bold'}}>Soft Bounce</span>}
                description={<WarningMessage />}
                type="warning"
            />
        }
        
        if (bounceStatus === 2){
            return <Alert
                message={<span style={{fontWeight: 'bold'}}>Hard Bounce</span>}
                description={<ErrorMessage />}
                type="error"
            />
        }
        
        return "";
    }
    
    return <>
        {getContainer()}
    </>
}

const UpdateSubscriber = () => {
    const dispatch = useDispatch()
    const drawerState = useSelector(selector => selector.subscriberDetailsDrawer)
    const tagsState = useSelector(selector => selector.tags)
    const {getAccessTokenSilently} = useAuth0();

    const [reloadTags, setReloadTags] = useState(false);
    const [loading, setLoading] = useState({
        screen: false,
        saveButton: false
    })
    const [subscriber, setSubscriber] = useState({
        dayOfBirth: [],
        monthOfBirth: [],
        dateSubscribed: new Date()
    })
    const [validations, setValidations] = useState({
        email: true
    })

    const onClose = () => {
        dispatch(updateSubscriberDetailsDrawer({
            drawerState: false
        }))
    }

    const areFieldsValid = () => {
        let currentValidationResult = { email: true };
        
        if (!validateEmail(subscriber.email)){
            currentValidationResult.email = false;
        }

        setValidations(currentValidationResult)
        return !Object.values(currentValidationResult).some(x => x == false);
    }

    const getSubscriberData = async () => {
        setLoading({
            ...loading,
            screen: true
        })
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/subscribers/getSubscriberDetails?id=${drawerState.subscriberId}`,
            method: 'get',
            successCallback: (response) => {
                debugger
                setSubscriber({
                    ...response.subscriber,
                    dayOfBirth: response.subscriber.dayOfBirth[0],
                    monthOfBirth: response.subscriber.monthOfBirth[0]
                })
                
                dispatch(updateSelectedTags(response.subscriber.tags === null ? [] : response.subscriber.tags))
                setLoading({
                    ...loading,
                    screen: false
                })
            },
            errorCallback: (err) => {
                setLoading({
                    ...loading,
                    screen: false
                })
            }
        })
    }

    const onUpdate = async () => {
        if (!areFieldsValid()){
            return;
        }
        
        setLoading({
            ...loading,
            saveButton: true
        })
        
        const request = {
            id: subscriber.id,
            firstName: subscriber.firstName,
            lastName: subscriber.lastName,
            email: subscriber.email,
            isSubscribed: subscriber.isSubscribed === subscriberType.Subscribed || subscriber.isSubscribed,
            tags: tagsState,
            phoneNumber: subscriber.phoneNumber,
            dayOfBirth: subscriber.dayOfBirth,
            monthOfBirth: subscriber.monthOfBirth
        };

        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/subscribers/updateSubscriber`,
            method: 'post',
            request: request,
            successCallback: (response) => {
                if (response.isSuccessful) {
                    onClose()
                    dispatch(setShouldReload({reload: true}))
                }

                setLoading({
                    ...loading,
                    saveButton: false
                })
            },
            errorCallback: () => {}
        })
    }

    useEffect(() => {
        if (drawerState.drawerOpened) {
            getSubscriberData()
            setReloadTags(true)
        }
        if (!drawerState.drawerOpened){
            setReloadTags(false)
        }
    }, [drawerState.drawerOpened])

    return (
        <>
            <Drawer title="Details" placement="right" onClose={onClose} visible={drawerState.drawerOpened}>
                <Spin spinning={loading.screen}>
                    <Row gutter={[16,16]}>
                        <Col span={24}>
                            <WarningMessageContainer 
                                bounceStatus={subscriber.bounceStatus}
                                reason={subscriber.bounceReason}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16, 16]}>
                        <Col span={12}>
                            <Input
                                onChange={event => setSubscriber({
                                    ...subscriber,
                                    firstName: event.target.value
                                })}
                                value={subscriber.firstName} placeholder="First Name"/>
                        </Col>
                        <Col span={12}>
                            <Input
                                onChange={event => setSubscriber({
                                    ...subscriber,
                                    lastName: event.target.value
                                })}
                                value={subscriber.lastName} placeholder="Last Name"/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16, 16]}>
                        <Col span={12}>
                            <Input
                                status={validations.email ? '' : "error"}
                                onChange={event => setSubscriber({
                                    ...subscriber,
                                    email: event.target.value
                                })}
                                value={subscriber.email} placeholder="Email"/>
                        </Col>
                        <Col span={12}>
                            <Input
                                onChange={event => setSubscriber({
                                    ...subscriber,
                                    phoneNumber: event.target.value
                                })}
                                value={subscriber.phoneNumber} placeholder="Phone Number"/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16, 16]}>
                        <Col span={12}>
                            <Select
                                style={{width: '100%'}}
                                placeholder="Day Of Birth"
                                onChange={val => setSubscriber({
                                    ...subscriber,
                                    dayOfBirth: val
                                })}
                                value={subscriber.dayOfBirth}>
                                {Array.from({length: 31}, (_, i) => i + 1).map(x => <Select.Option key={x} value={x}>{x}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <Select
                                style={{width: '100%'}}
                                placeholder="Month Of Birth"
                                onChange={val => setSubscriber({
                                    ...subscriber,
                                    monthOfBirth: val
                                })}
                                value={subscriber.monthOfBirth ? subscriber.monthOfBirth - 1 : subscriber.monthOfBirth}>
                                {moment.months().map((x, index) => <Select.Option key={index++}
                                                                               value={index++}>{x}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16, 16]}>
                        <Col span={12}>
                            <Select
                                disabled={subscriber.unsubscribedFromEmail || subscriber.isSubscribed === subscriberType.NotSubscribed}
                                style={{width: '100%'}}
                                placeholder="Is Subscriber"
                                onChange={val => setSubscriber({
                                    ...subscriber,
                                    isSubscribed: val
                                })}
                                value={!subscriber.isSubscribed ? subscriberType.NotSubscribed : subscriberType.Subscribed}>
                                {subscriberTypeOptions.map((x) => <Select.Option key={x.id}
                                                                               value={x.id}>{x.name}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <Input value={formatDate({value: subscriber.dateSubscribed})} disabled placeholder="Date Subscribed"/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16, 16]}>
                        <Col span={24}>
                            <Tags customReload={reloadTags} />
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16, 16]}>
                        <Col span={24}>
                            <Button 
                                disabled={subscriber.bounceStatus === 2}
                                onClick={onUpdate} 
                                style={{float: 'right'}} 
                                type="primary"
                                loading={loading.saveButton}>Update</Button>
                        </Col>
                    </Row>
                </Spin>
            </Drawer>
        </>
    );
}

export default UpdateSubscriber