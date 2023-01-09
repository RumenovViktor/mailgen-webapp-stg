import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs/dist/grapes.min.js'
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css'
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.min'
import React, {useEffect, useState} from "react";
import {Button, Col, Input, Row} from "antd";
import {WarningOutlined} from "@ant-design/icons";
import MergeTags from "../SimpleEmailTemplate/components/MergeTags";
import {callApi} from "../utils/apiHelper";
import queryString from "query-string";
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from "react-router-dom";

const EmailTemplateBuilder = (props) => {
    const query = queryString.parse(props.location.search)
    const {getAccessTokenSilently} = useAuth0();
    const history = useHistory()
    
    const [editor, setEditor] = useState();
    const [model, setModel] = useState({
        name: ''
    });
    const [loading, setLoading] = useState({
        button: false,
        page: false
    });
    
    const [validation, setValidation] = useState({
        name: true
    });

    const validateFields = () => {
        let validations = {
            name: true,
            editor: true
        }
        if (!model.name.length){
            validations.name = false;
        }

        setValidation(validations)
        return !Object.values(validations).some(x => x === false);
    }

    function replaceLast(find, replace, string) {
        var lastIndex = string.lastIndexOf(find);

        if (lastIndex === -1) {
            return string;
        }

        var beginString = string.substring(0, lastIndex);
        var endString = string.substring(lastIndex + find.length);

        return beginString + replace + endString;
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

        let finalHtml = '';
        const html = getEditorHtml();
        
        if (!query.id){
            let htmlFirstReplaced = html.replace('body', 'div')
            finalHtml = replaceLast('body', 'div', htmlFirstReplaced)    
        }else {
            finalHtml = html;
        }
        
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
                name: model.name,
                html: finalHtml,
                baseHtml: baseHtml,
                templateType: 1
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
        var host = 'https://artf.github.io/grapesjs/';
        var images = [
            host + 'img/grapesjs-logo.png',
            host + 'img/tmp-blocks.jpg',
            host + 'img/tmp-tgl-images.jpg',
            host + 'img/tmp-send-test.jpg',
            host + 'img/tmp-devices.jpg',
        ];

        const initEditor = grapesjs.init({
            container : '#gjs',
            plugins: ['gjs-preset-newsletter'],
            assetManager: {
                assets: images,
                upload: false,
                uploadText: 'Uploading is not available in this demo',
            },
            pluginsOpts: {
                'gjs-preset-newsletter': {
                    modalTitleImport: 'Import template',
                    // ... other options
                }
            }
        });
        
        setEditor(initEditor);

        if (query.id) {
            setLoading({
                ...loading,
                page: true
            })
            await callApi(getAccessTokenSilently, {
                url: `${process.env.REACT_APP_API_BASE}/emailTemplates/getById?id=${query.id}`,
                method: 'get',
                successCallback: (response) => {
                    setModel({
                        name: response.template.name
                    })
                    
                    initEditor.setComponents(response.template.html)
                    
                    setLoading({
                        ...loading,
                        page: false
                    })
                },
                errorCallback: (error) => { }
            });
        } else{
            initEditor.setComponents('')
        }
        
    },[])
    
    const getEditorHtml = () => editor.runCommand('gjs-get-inlined-html');
    
    return <>
        <Row gutter={[16,16]}>
            <Col span={5}>
                <Input
                    status={validation.name ? '' : 'error'}
                    prefix={validation.name ? '' : <WarningOutlined />}
                    onChange={(event) => {
                        setModel({
                            ...model,
                            name: event.target.value
                        })
                    }}
                    value={model.name}
                    placeholder="Name" />
            </Col>
            <Col span={2}>
                <MergeTags />
            </Col>
            <Col span={17}>
                <Button style={{float: 'right'}} onClick={async e => await save()}>Save</Button>
            </Col>
        </Row>
        <Row style={{marginTop: 10}}>
            <Col span={24}>
                <div id="gjs"></div>
            </Col>
        </Row>
    </>
}

export default EmailTemplateBuilder;