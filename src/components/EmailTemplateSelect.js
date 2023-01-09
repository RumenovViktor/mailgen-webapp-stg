import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import {Button, Col, Dropdown, Menu, Row, Select} from "antd";
import {callApi} from "../utils/apiHelper";
import {DragOutlined, FormOutlined, PlusOutlined, RedoOutlined} from "@ant-design/icons";

const menu = (
    <Menu
        items={[
            {
                key: '1',
                icon: <FormOutlined />,
                label: (
                    <a target="_blank" rel="noopener noreferrer" href="/simple-template">
                        Create a simple template
                    </a>
                ),
            },
            {
                key: '2',
                icon: <DragOutlined />,
                label: (
                    <a target="_blank" rel="noopener noreferrer" href="/drag-and-drop   ">
                        Drag & Drop Builder
                    </a>
                ),
            }
        ]}
    />
);

const EmailTemplateSelect = (props) => {
    const {
        value,
        handler,
        disabled,
        valid
    } = props

    const [source, setSource] = useState([])
    const { getAccessTokenSilently } = useAuth0();

    const getTemplates = async () => {
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/emailTemplates/getTemplates`,
            method: 'get',
            successCallback: response => {
                const data = response.templates.map(template => {
                    return {
                        id: template.id,
                        name: template.name
                    }
                })
                setSource(data)
            },
            errorCallback: (error) => {
            }
        })
    }

    useEffect(() => getTemplates(), [])

    return <>
        <Row gutter={[16,16]}>
            <Col span={20}>
                <Select
                    style={{width: '100%', textAlign: 'left'}}
                    placeholder="Select template..."
                    disabled={disabled}
                    onChange={handler}
                    value={value}
                    status={valid ? '' : 'error'}>
                    {source.map(x => <Select.Option key={x.id} value={x.id}>{x.name}</Select.Option>)}
                </Select>
            </Col>
            <Col span={4}>
                <Button size="small" style={{float: 'left', marginTop: '5%'}} shape="circle" onClick={async () => await getTemplates()} icon={<RedoOutlined />}></Button>
            </Col>
        </Row>
        <Row>
            <Col span={2}>
                <Dropdown
                    overlay={menu}
                    placement="bottom"
                    arrow={{
                        pointAtCenter: true,
                    }}
                >
                    <Button type="link" icon={<PlusOutlined />}>Add email template</Button>
                </Dropdown>
            </Col>
        </Row>
    </>
}

export default EmailTemplateSelect