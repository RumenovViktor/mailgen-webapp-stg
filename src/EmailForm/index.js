import * as React from 'react'
import generateHtml from '../utils/formHtmlGenerator';
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../config";
import {Alert, Card, Col, Row, Space, Switch} from "antd";
import Tags from "../components/Tags";
import TextArea from "antd/es/input/TextArea";
import styled from "styled-components";
import {useSelector} from "react-redux";

export const AlertTitle = styled.span`
    color: #1a3353;
    font-weight: 700;
    font-size: 17px;
    display: block;
    text-align: left;
    padding-bottom: 5px;
`;

export const ListItem = styled.li`
    color: #1a3353;
    font-weight: 500;
    font-size: 14px;
`;

const CreateForm = () => {
    const {getAccessTokenSilently} = useAuth0();
    const config = getConfig()
    const tags = useSelector(x => x.tags)
    const [customerId, setCustomerId] = useState('')
    const [fields, setFields] = useState({
        firstName: true,
        lastName: true,
        birthDate: true,
        phoneNumber: true
    })
    const [pageLoading, setPageLoading] = useState(false)

    const callApi = async () => {
        setPageLoading(true)
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });

        fetch(`${process.env.REACT_APP_API_BASE}/customer/getCustomerId`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(response => {
                setCustomerId(response.id)
                setPageLoading(false)
            })
            .catch(err => console.log(err.message))
    }

    const buildFormModel = (uId) => {
        return {
            u: uId,
            firstNameIncluded: fields.firstName,
            lastNameIncluded: fields.lastName,
            birthDateIncluded: fields.birthDate,
            phoneNumberIncluded: fields.phoneNumber,
            tags: tags
        }
    }

    useEffect(() => callApi(), [])

    useEffect(() => {
        generateHtml(buildFormModel(customerId))
    }, [fields, tags])

    return <>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Alert
                    message={<AlertTitle>How to use the forms</AlertTitle>}
                    description={<>
                        <ol style={{
                            textAlign: 'left'
                        }}>
                            <ListItem>Select the tags that you want your subscribers to be tagged with</ListItem>
                            <ListItem>Select which fields you want to collect from your subscribers</ListItem>
                            <ListItem>Copy the generated html</ListItem>
                            <ListItem>Paste it in your website and style it according to your website design using CSS</ListItem>
                        </ol>
                    </>}
                    type="info"
                />
            </Col>
        </Row>
        <Row style={{marginTop: 10}} gutter={[16, 16]}>
            <Col span={8}>
                <Card>
                    <Row>
                        <Col span={24}>
                            <Tags/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={24}>
                            <div style={{float: 'left'}}>
                                <Space>
                                    <Switch onChange={(val) => {
                                        setFields({
                                            ...fields,
                                            firstName: val
                                        })
                                    }} defaultChecked/>
                                    <span>First Name</span>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={24}>
                            <div style={{float: 'left'}}>
                                <Space>
                                    <Switch onChange={(val) => {
                                        setFields({
                                            ...fields,
                                            lastName: val
                                        })
                                    }} defaultChecked/>
                                    <span>Last Name</span>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={24}>
                            <div style={{float: 'left'}}>
                                <Space>
                                    <Switch onChange={(val) => {
                                        setFields({
                                            ...fields,
                                            birthDate: val
                                        })
                                    }} defaultChecked/>
                                    <span>Birth Date</span>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={24}>
                            <div style={{float: 'left'}}>
                                <Space>
                                    <Switch onChange={(val) => {
                                        setFields({
                                            ...fields,
                                            phoneNumber: val
                                        })
                                    }} defaultChecked/>
                                    <span>Phone Number</span>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <div style={{textAlign: 'left'}} dangerouslySetInnerHTML={generateHtml(buildFormModel(customerId), process.env.REACT_APP_API_BASE)} />
                </Card>
            </Col>
            <Col span={8}>
                <pre lang="html">
                    <TextArea rows={20} value={generateHtml(buildFormModel(customerId), process.env.REACT_APP_API_BASE).__html.replace(/</g, '<').replace(/>/g, '>')} />
                </pre>
            </Col>
        </Row>
    </>
}

export default CreateForm