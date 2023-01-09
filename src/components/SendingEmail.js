import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../config";
import {Button, Col, Row, Select} from "antd";
import {updateSendingEmails} from "../features/sendingEmailsSlice";
import {useHistory} from "react-router-dom";
import {PlusOutlined, RedoOutlined} from "@ant-design/icons";

const SendingEmail = ({customReload, status, disabled}) => {
    const dispatch = useDispatch();
    const selectedSendingEmails = useSelector(selector => selector.sendingEmails)
    const [sendingEmailsSource, setSendingEmailsSource] = useState([])
    const {getAccessTokenSilently} = useAuth0();
    const history = useHistory()

    const config = getConfig()

    const callApi = async () => {
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });

        fetch(`${process.env.REACT_APP_API_BASE}/sendingEmails/all`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(response => {
                setSendingEmailsSource(response.data.sendingEmails)
            })
            .catch(x => console.log(x.message))
    }

    useEffect(() => callApi(), [])

    useEffect(() => {
        if (customReload){
            callApi()
        }
    }, [customReload])

    return <>
        <Row gutter={[16,16]}>
            <Col span={20}>
                <Select
                    disabled={disabled}
                    status={status ? status : ""}
                    style={{ width: '100%', textAlign: 'left' }}
                    placeholder="Select sending email ..."
                    value={selectedSendingEmails}
                    allowClear
                    onChange={(selected) => {
                        dispatch(updateSendingEmails(selected))
                    }}
                >
                    {sendingEmailsSource.map((x, index) => {
                        if (x.status === 1){
                            return <Select.Option value={x.id} key={index}>{x.email}</Select.Option>;
                        }
                    })}
                </Select>
            </Col>
            <Col span={4}>
                <Button size="small" style={{float: 'left', marginTop: '5%'}} shape="circle" onClick={async () => await callApi()} icon={<RedoOutlined />}></Button>
            </Col>
        </Row>
        <Row>
            <Col span={2}>
                <Button icon={<PlusOutlined />} style={{float: 'left'}} onClick={() => window.open('/profile?tab=sendingSettings','_blank')} type="link">Add sending email</Button>
            </Col>
        </Row>
    </>
}

export default SendingEmail;