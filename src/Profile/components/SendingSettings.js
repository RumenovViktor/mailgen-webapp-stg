import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Drawer, Input, Modal, notification, Row, Table, Tag, Tooltip} from "antd";
import {callApi} from "../../utils/apiHelper";
import {useAuth0} from "@auth0/auth0-react";
import {DeleteOutlined, PlusOutlined, RedoOutlined} from "@ant-design/icons";
import {ContainerWrapper} from "../../reportComponents/CampaignStyles";
import {setShouldReload} from "../../features/subscribers/reloadAudienceReportSlice";
import validateEmail from "../../utils/ValueValidations";

const SendingSettings = () => {
    const {getAccessTokenSilently} = useAuth0();
    
    const [sendingEmails, setSendingEmails] = useState([])
    const [selectedSendingEmailForDelete, setSelectedSendingEmailForDelete] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sendingEmailForAdd, setSendingEmailForAdd] = useState('')
    const [addEmailDrawerOpened, setAddEmailDrawerOpened] = useState(false)
    const [loading, setLoading] = useState({
        tableLoading: false,
        addEmailButton: false
    })
    
    const getDatasource = async () => {
        setLoading({
            ...loading,
            tableLoading: true
        })
        const options = {
            url: `${process.env.REACT_APP_API_BASE}/sendingEmails/all`,
            method: 'get',
            successCallback: (response) => {
                setSendingEmails(response.data.sendingEmails)
                setLoading({
                    ...loading,
                    tableLoading: false
                })
            },
            errorCallback: (err) => {
                console.log(err.message)
                setLoading({
                    ...loading,
                    tableLoading: false
                })
            }
        }

        await callApi(getAccessTokenSilently, options)
    }
    
    const onDelete = (sendingEmailId) => {
        setSelectedSendingEmailForDelete(sendingEmailId)
        setDeleteModalOpen(true)
    }
    
    const deleteSendingEmail = async () => {
        if (selectedSendingEmailForDelete.length < 1){
            return;    
        }
        const options = {
            url: `${process.env.REACT_APP_API_BASE}/sendingEmails/delete`,
            method: 'post',
            request: {
                SendingEmailId: selectedSendingEmailForDelete
            },
            successCallback: async (response) => {
                await getDatasource();
                setDeleteModalOpen(false)
                debugger
                if (!response.success){
                    notification.error({
                        message: `Error deleting a sending email!`,
                        description: 'One or more campaigns/automatic emails are currently using this sending email',
                        placement: "bottomLeft",
                    });
                }
            },
            errorCallback: (err) => {
                setDeleteModalOpen(false)
            }
        }

        await callApi(getAccessTokenSilently, options)
    }

    const addSendingEmail = async () => {
        if (sendingEmailForAdd.length < 1){
            return;
        }
        
        setLoading({
            ...loading,
            addEmailButton: true
        })

        const options = {
            url: `${process.env.REACT_APP_API_BASE}/sendingEmails/add`,
            method: 'post',
            request: {
                email: sendingEmailForAdd
            },
            successCallback: async (response) => {
                await getDatasource();
                setAddEmailDrawerOpened(false)
                setLoading({
                    ...loading,
                    addEmailButton: false
                })
            },
            errorCallback: (err) => {
                setAddEmailDrawerOpened(false)
                setLoading({
                    ...loading,
                    addEmailButton: false
                })
            }
        }

        await callApi(getAccessTokenSilently, options)
    }
    
    const getColumns = () => {
        return [
            {
                title: 'Email',
                dataIndex: 'email',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => {
                    if (status === 0){
                        return <Tag color="grey">Pending</Tag>
                    }
                    
                    if (status === 1){
                        return <Tag color="green">Verified</Tag>
                    }
                } 
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                render: (_, {id}) => {
                    return <Button 
                        danger 
                        shape="round" 
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(id)}
                    />
                }
            }
        ]
    }
    
    useEffect(() => {
        getDatasource();
    }, [])
    
    return <>
        <ContainerWrapper>
            <Row>
                <Col span={24}>
                    <Alert
                        style={{textAlign: "left"}}
                        message="Note"
                        description="After adding the record, you will be sent an email to verify the added email address."
                        type="info"
                        showIcon
                    />
                </Col>
            </Row>
            <Row style={{marginTop: 20}} gutter={[16,16]}>
                <Col span={12}>
                    <div style={{float: 'left'}}>
                        <h3>Sending Emails</h3>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{float: 'right'}}>
                        <Tooltip title="Refresh">
                            <Button onClick={async () => await getDatasource() } shape="circle" icon={<RedoOutlined />} />
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col>
                    <Button onClick={() => setAddEmailDrawerOpened(true)} shape="round" icon={<PlusOutlined />}>Add email</Button>
                </Col>
            </Row>
            <Row style={{marginTop: 10}} gutter={[16, 16]}>
                <Col span={24}>
                    <Table 
                        loading={loading.tableLoading}
                        columns={getColumns()} 
                        dataSource={sendingEmails} size="middle"
                    />
                </Col>
            </Row>
        </ContainerWrapper>
        <Modal
            title="Delete sending email"
            style={{
                top: 20,
            }}
            visible={deleteModalOpen}
            onOk={async () => await deleteSendingEmail()}
            onCancel={() => {
                setSelectedSendingEmailForDelete('')
                setDeleteModalOpen(false)
            }}
        >
            <span>Are you sure you want to delete this sending email?</span>
        </Modal>
        <Drawer title="Details" placement="right" visible={addEmailDrawerOpened} onClose={() => setAddEmailDrawerOpened(false)}>
            <Row gutter={[16,16]}>
                <Col span={24}>
                    <Input
                        onChange={event => setSendingEmailForAdd(event.target.value)}
                        value={sendingEmailForAdd} placeholder="Email"/>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col>
                    <Button 
                        disabled={!validateEmail(sendingEmailForAdd)} 
                        onClick={addSendingEmail} 
                        type="primary"
                        loading={loading.addEmailButton}
                    >
                        Add Email
                    </Button>
                </Col>
            </Row>
        </Drawer>
    </>
}

export default SendingSettings;