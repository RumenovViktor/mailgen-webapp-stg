import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Alert, Button, Card, Col, Popconfirm, Progress, Row, Spin, Table} from "antd";
import {useHistory} from "react-router-dom";
import styled from 'styled-components';
import {callApi} from "../../utils/apiHelper";

const Anchor = styled.a`
    margin-left: 5px;
    text-decoration: underline; 
    font-weight: bold; 
    cursor: pointer;
`;

const GeneralInformation = ({isActive}) => {
    const history = useHistory()
    const {getAccessTokenSilently} = useAuth0();
    const [accountDetails, setAccountDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [cancelButtonLoading, setCancelButtonLoading] = useState(false)
    const [messages, setMessages] = useState({
        cancelMessage: false
    })

    const confirm = async () => {
        setCancelButtonLoading(true)
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/account/subscription/cancel`,
            method: 'post',
            request: {},
            successCallback: (response) => {
                setMessages({
                    ...messages,
                    cancelMessage: true
                })
                setCancelButtonLoading(false)
            },
            errorCallback: () => {
            }
        })
    }

    const cancel = async () => {

    }

    const getColumns = () => {
        return [
            {
                title: 'Plan',
                dataIndex: 'plan',
            },
            {
                title: 'Subscribers Quantity',
                dataIndex: 'subscribersQuantity',
            },
            {
                title: 'Sent Emails',
                dataIndex: 'emailsSentForPeriod'
            },
            {
                title: 'Status',
                dataIndex: 'status',
            },
            {
                title: 'Upgrade',
                dataIndex: 'upgrade',
                render: () => {
                    return <Button onClick={() => history.push('/profile?tab=billing')}
                                   type="primary"> Upgrade </Button>;
                }
            },
            {
                title: 'Cancel',
                dataIndex: 'cancel',
                render: () => {
                    return <>
                        <Popconfirm
                            title="With this action, your subscription will be cancelled at the end of the billing period. Are you sure you want to proceed?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                loading={cancelButtonLoading}
                                disabled={accountDetails.accountType !== 1 || accountDetails.subscriptionStatus !== 0 || messages.cancelMessage}
                                danger>Cancel</Button>
                        </Popconfirm>
                    </>
                }
            },
        ]
    }

    const getDatasource = () => {
        let subscriptionStatus = 'Active';
        switch (accountDetails.subscriptionStatus) {
            case 0:
                subscriptionStatus = "Active";
                break;
            case 1:
                subscriptionStatus = "Failed";
                break;
            case 2:
                subscriptionStatus = "Cancelled";
                break;
        }
        
        return [
            {
                key: '1',
                plan: accountDetails.accountType === 1 ? "Pro" : 'Free',
                subscribersQuantity: accountDetails.quota,
                status: subscriptionStatus,
                emailsSentForPeriod: `${accountDetails.emailsSentForPeriod}/${accountDetails.allowedEmailsCount}`
            }
        ];
    }

    const getAccountDetails = async () => {
        console.log('loading')
        setMessages({
            ...messages,
            cancelMessage: false
        })
        const options = {
            url: `${process.env.REACT_APP_API_BASE}/account/details`,
            method: 'get',
            successCallback: (response) => {
                setAccountDetails(response)
                if (response.subscriptionStatus === 2) {
                    setMessages({
                        ...messages,
                        cancelMessage: true
                    })
                }
                setLoading(false)
            },
            errorCallback: (err) => {
                console.log(err.message)
            }
        }

        await callApi(getAccessTokenSilently, options)
    }

    useEffect(() => {
        if (isActive){
            getAccountDetails()
        }
    }, [isActive])

    useEffect(() => {
        getAccountDetails()
    }, [])

    return <>
        <Spin spinning={loading}>
            <Row>
                <Col span={24}>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col span={1}>
                                <span style={{fontWeight: 500}}>Contacts</span>
                            </Col>
                            <Col span={22}>
                            <span style={{
                                float: 'right',
                                fontWeight: 500
                            }}>{accountDetails.subscribersCount} of {accountDetails.quota}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Progress type={"line"}
                                          percent={accountDetails.subscribersCount / accountDetails.quota * 100}/>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                            <span
                                style={{fontWeight: 300}}>{accountDetails.quota - accountDetails.subscribersCount} contacts remaining for your current plan</span>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 30}} gutter={[16, 16]}>
                            <Col span={24}>
                                <Table columns={getColumns()} dataSource={getDatasource()} size="middle"
                                       pagination={false}/>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            {accountDetails.subscriptionStatus === 1 ? <>
                <Row gutter={[16, 16]} style={{marginTop: 10}}>
                    <Col span={12}>
                        <Alert
                            style={{textAlign: 'left'}}
                            message="The payment for the card provided failed."
                            description={<>
                            <span>
                                The payment for the card provided failed.
                            <Anchor onClick={() => history.push('/profile?tab=billing')}>
                                Consider updating your card information 
                            </Anchor> 
                                 and paying
                            <Anchor onClick={x => window.open(accountDetails.invoiceUrl, '_blank')}>
                                your invoice
                            </Anchor>.
                            </span>
                            </>}
                        >
                        </Alert>
                    </Col>
                </Row>
            </> : ""}
            {messages.cancelMessage ? <>
                <Row gutter={[16, 16]} style={{marginTop: 10}}>
                    <Col span={24}>
                        <Alert
                            style={{textAlign: 'left'}}
                            showIcon
                            type="warning"
                            message="Subscription was cancelled"
                            description={<>
                                <div>
                                    <span>
                                        Your subscription will end at the end of the billing period.
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        Until then, you can continue using the platform.
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        Unfortunately at this point you can not renew it with the same tier. You can only upgrade to a higher tier.
                                    </span>
                                </div>
                            </>}
                        >
                        </Alert>
                    </Col>
                </Row>
            </> : ""}
        </Spin>
    </>
}

export default GeneralInformation;