import React, {useEffect, useState} from "react"
import {useAuth0} from "@auth0/auth0-react";
import {ContainerWrapper} from "../reportComponents/CampaignStyles";
import {Button, Col, Row, Space, Table} from "antd";
import AudienceReportHeader from "./components/audienceReportHeader";
import {getAudienceColumns} from "./logic/columns";
import {callApi} from "../utils/apiHelper";
import DeleteDialog from "../components/DeleteDialog";
import {useDispatch, useSelector} from "react-redux";
import {setShouldReload} from "../features/subscribers/reloadAudienceReportSlice";
import {SendOutlined} from "@ant-design/icons";
import UpdateSubscriber from "./components/updateSubscriber";
import ImportSubscribers from "./components/importSubscribers";
import SendEmailsByTags from "./components/sendEmailsByTags";
import {setSubscriberManagementDrawerState} from "../features/subscribers/subscriberManagementDrawerSlice";
import SendEmailsForSubscribers from "./components/sendEmailsForSubscribers";

const Audience = () => {
    const shouldReload = useSelector(x => {
        return x.reloadAudienceReport.reload
    });
    const subscriberManagementState = useSelector(x => x.subscriberManagementDrawer);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [audience, setAudience] = useState([]);
    const [selectedSubscribers, setSelectedSubscribers] = useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [buttonsDisabled, setButtonsDisabled] = useState({
        sendEmails: true,
        sendEmailsByTags: false
    })
    const [page, setPage] = useState({
        current: 1,
        size: 10
    });
    
    const {getAccessTokenSilently} = useAuth0();

    const getAudience = async () => {        
        setLoading(true)
        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/subscribers/getSubscribers?currentPage=${page.current}&pageSize=${page.size}`,
            method: 'get',
            successCallback: (response) => {
                setAudience(response.subscribers)
                setTotalPages(response.totalPages)
                setLoading(false)
                dispatch(setShouldReload({reload: false}))
            },
            errorCallback: () => {}
        })
    }

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            if (selectedRowKeys.length){
                setButtonsDisabled({
                    sendEmails: false,
                    sendEmailsByTags: true
                })
            } else {
                setButtonsDisabled({
                    sendEmails: true,
                    sendEmailsByTags: false
                })
            }
            
            setSelectedSubscribers(selectedRowKeys)
        },
        getCheckboxProps: (record) => {
            return {
                name: record.id,
            };
        },
    };
    
    useEffect(() => {
        getAudience()
    }, [])
    
    useEffect(() => {
        if (shouldReload){
            getAudience()
        }
    }, [shouldReload, page.current])

    useEffect(() => {
        getAudience()
    }, [page.current])

    return <>
        <ContainerWrapper>
            <Row>
                <Col span={24}>
                    <AudienceReportHeader />
                </Col>
            </Row>
            <Row>
                <Space>
                <Col span={3}>
                    <Button 
                        disabled={buttonsDisabled.sendEmailsByTags} 
                        icon={<SendOutlined />} 
                        type="default" 
                        style={{float: 'left'}}
                        onClick={() => {
                            dispatch(setSubscriberManagementDrawerState({
                                ...subscriberManagementState,
                                sendEmailsByTags: true
                            }))
                        }}>
                        Send Emails By Tags
                    </Button>
                </Col>
                <Col span={3}>
                    <Button 
                        disabled={buttonsDisabled.sendEmails} 
                        icon={<SendOutlined />} 
                        type="default" 
                        style={{float: 'left'}}
                        onClick={() => {
                            dispatch(setSubscriberManagementDrawerState({
                                ...subscriberManagementState,
                                sendEmailsForSubscribers: true
                            }))
                        }}>
                        Send Emails
                    </Button>
                </Col>
                </Space>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>
                    <Table
                        loading={loading}
                        columns={getAudienceColumns()}
                        dataSource={audience.map(x => {
                            return {
                                ...x,
                                key: x.id
                            }
                        })}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection
                        }}
                        pagination={{
                            current: page.current,
                            onChange: (pageNumber) => setPage({...page, current: pageNumber}),
                            total: totalPages,
                            pageSize: 10,
                            showSizeChanger: false,
                            showQuickJumper: true
                        }}
                    />
                </Col>
            </Row>
        </ContainerWrapper>
        <DeleteDialog />
        <UpdateSubscriber />
        <ImportSubscribers />
        <SendEmailsByTags />
        <SendEmailsForSubscribers selectedSubscribers={selectedSubscribers} />
    </>
}

export default Audience