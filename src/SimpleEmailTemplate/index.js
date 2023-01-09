import React, {useEffect, useState} from 'react';
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertToRaw, EditorState} from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import {useAuth0} from "@auth0/auth0-react";
import queryString from "query-string";
import htmlToDraft from 'html-to-draftjs';
import ContentState from "draft-js/lib/ContentState";
import { useHistory } from "react-router-dom";
import {Button, Col, Input, Row, Spin} from "antd";
import {WarningOutlined} from "@ant-design/icons";
import {callApi} from "../utils/apiHelper";
import MergeTags from "./components/MergeTags";

const SimpleEmailTemplate = (props) => {
    const history = useHistory()
    const {getAccessTokenSilently} = useAuth0();
    const query = queryString.parse(props.location.search)
    
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [name, setName] = useState('');
    const [loading, setLoading] = useState({
        page: false,
        saveButton: false
    })
    const [validations, setValidations] = useState({
        name: true,
        editor: true
    })

    const onEditorStateChange = (state) => {
        setEditorState(state)
    }
    
    const validateFields = () => {
        let validations = {
            name: true,
            editor: true
        }
        if (!name.length){
            validations.name = false;
        }
        
        if (draftToHtml(convertToRaw(editorState.getCurrentContent())) == '<p></p>\n'){
            validations.editor = false;
        }
        
        setValidations(validations)
        return !Object.values(validations).some(x => x === false);
    }
    
    const save = async () => {
        const validationPassed = validateFields();
        if (!validationPassed){
            return;
        }

        setLoading({
            ...loading,
            saveButton: true
        })
        
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const baseHtml = `
            <!DOCTYPE html>
            <html>
                <body>
                    <div>
                        {HTML_CONTENT_HERE}
                    </div>
                    <div style="text-align: center">
                        <span>No longer interested?</span><a id="unsubscribe" href="{{BASE_ADDRESS}}/subscribers/unsubscribe?email={{SUBSCRIBER_EMAIL}}&subscriberId={{SUBSCRIBER_ID}}&returnUrl=https://mailgen.org/unsubscribe/">Unsubscribe</a>
                    </div>
                    <div id="platform-advertisement" style="text-align: center;margin-top:25px;">
                        <a style="display: inline-block;vertical-align: middle;line-height: normal;text-decoration: none;color: inherit;" href="https://mailgen.org" target="_blank">
                            <img style="display: inline-block;vertical-align: middle;line-height: normal;" alt="mailgen" height="80" width="150" src={process.env.PUBLIC_URL + '/PoweredByMailgen.png'} />
                        </a>
                    </div>
                </body>
            </html>`;
        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/emailTemplates/upsertTemplate`,
            method: 'post',
            request: {
                id: query.id,
                name: name,
                html: html,
                baseHtml: baseHtml,
                type: 0
            },
            successCallback: (response) => {
                history.push('/templates')
                setLoading({
                    ...loading,
                    saveButton: false
                })
            },
            errorCallback: (error) => {
                setLoading({
                    ...loading,
                    saveButton: false
                })
            }
        });
    }
    
    useEffect(async () => {
        if (query.id) {
            setLoading({
                ...loading,
                page: true
            })
            await callApi(getAccessTokenSilently, {
                url: `${process.env.REACT_APP_API_BASE}/emailTemplates/getById?id=${query.id}`,
                method: 'get',
                successCallback: (response) => {
                    setName(response.template.name)
                    const contentBlock = htmlToDraft(response.template.html);
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);
                    setLoading({
                        ...loading,
                        page: false
                    })
                    setEditorState(editorState)
                },
                errorCallback: (error) => { }
            });
        }
    }, [])

    return <>
        <Spin spinning={loading.page}>
            <Row gutter={[16,16]}>
                <Col span={5}>
                    <Input
                        status={validations.name ? '' : 'error'}
                        prefix={validations.name ? '' : <WarningOutlined />}
                        onChange={(event) => {
                            setName(event.target.value)
                        }}
                        value={name}
                        placeholder="Name" />
                </Col>
                <Col span={2}>
                    <MergeTags />
                </Col>
                <Col span={17}>
                    <Button loading={loading.saveButton} onClick={async () => await save()} style={{float: 'right'}}>Save</Button>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>
                    <Editor
                        editorState={editorState}
                        editorStyle={{
                            backgroundColor: 'white',
                            border: validations.editor ? '1px solid #F1F1F1' : '1px solid red',
                            height: 580,
                            padding: 5
                        }}
                        onEditorStateChange={onEditorStateChange}
                    />
                </Col>
            </Row>
        </Spin>
    </>
}

export default SimpleEmailTemplate