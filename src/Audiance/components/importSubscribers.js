import {useState} from "react";
import {Button, Col, Divider, Modal, Row, Select, Upload, message, Alert} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setSubscriberManagementDrawerState} from "../../features/subscribers/subscriberManagementDrawerSlice";
import Tags from "../../components/Tags";
import styled from 'styled-components'
import * as React from "react";
import {UploadOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import ImportedContacts from "./importComponents/ImportedContacts";
import {callApi} from "../../utils/apiHelper";
import {setShouldReload} from "../../features/subscribers/reloadAudienceReportSlice";

const subscriberType = Object.freeze({
    NotSubscribed: 0,
    Subscribed: 1
})

const subscriberTypeOptions = Object.freeze([{
    id: subscriberType.Subscribed,
    name:"Subscribers"
}, {
    id: subscriberType.NotSubscribed,
    name: "Not Subscribers"
}])

const Text = styled.span`
    // color: #1a3353;
    font-weight: 500;
    font-size: 15px;
`;

const ImportSubscribers = () => {
    const state = useSelector(x => x.subscriberManagementDrawer)
    const subscribersEndState = useSelector(x => x.importSubscribersTransformedData)
    const tags = useSelector(x => x.tags)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [importErrorMessage, setImportErrorMessage] = useState('')
    const [model, setModel] = useState({
        areSubscribers: subscriberType.Subscribed,
        importedSubscribers: []
    })

    const { getAccessTokenSilently } = useAuth0();

    const CSVToArray = ( strData, strDelimiter ) => {
        strDelimiter = (strDelimiter || ",");
        
        let objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + strDelimiter + "\\r\\n]*))" ),"gi");
        let arrData = [[]];
        let arrMatches = null;

        while (arrMatches = objPattern.exec( strData )){
            let strMatchedDelimiter = arrMatches[ 1 ];
            
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter){
                arrData.push( [] );
            }

            let strMatchedValue;
            
            if (arrMatches[ 2 ]){
                strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ), "\"");
            } else {
                strMatchedValue = arrMatches[ 3 ];
            }
            
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }
        
        return( arrData );
    }

    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        beforeUpload(file) {
            const isCsv = file.type === 'text/csv';
            if (!isCsv) {
                message.error(`${file.name} is not a valid csv file`);
            }

            return isCsv || Upload.LIST_IGNORE;
        },
        onChange(info) {
            if (info.file.status === 'removed'){
                message.success(`${info.file.name} was removed`);
                setModel({
                    ...model,
                    importedSubscribers: []
                })
                return;     
            }
            
            if (info.file.status !== 'uploading') {
                message.info(`${info.file.name} is being processed`);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
            
            const fileReader = new FileReader()
            fileReader.readAsText(info.file.originFileObj)
            fileReader.onloadend = (fileResult) => {
                const recordsArray = CSVToArray(fileResult.target.result);
                const headers = recordsArray[0];
                let records = [];
                
                for (let i = 1; i < recordsArray.length; i++){
                    if (recordsArray[i][0] === ''){
                        continue;
                    }
                    
                    let obj = {};

                    headers.forEach((header, headerIndex) => {
                        obj[header] = recordsArray[i][headerIndex];
                    })
                    
                    records.push(obj);
                }

                setImportErrorMessage('')
                setModel({
                    ...model,
                    importedSubscribers: records
                })
            }
        },
    };
    
    const handleOk = async () => {
        // setLoading(true);
        let subscribersListForSave = [];
        
        subscribersEndState.imported.forEach(importedSubscriber => {
            let obj = {
                extra: {}
            }
            for (let key in importedSubscriber){
                const modifiedFieldValue = subscribersEndState.modifiedFieldsValues[key];
                
                if (modifiedFieldValue){
                    if (modifiedFieldValue === 'email'){
                        obj['email'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'ipAddress'){
                        obj['ipAddress'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'firstName'){
                        obj['firstName'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'lastName'){
                        obj['lastName'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'phoneNumber'){
                        obj['phoneNumber'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'birthDate'){
                        obj['birthDate'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'tags'){
                        console.log(importedSubscriber[key])
                        const splited = importedSubscriber[key].split(',')
                        const checked = splited[0] === '' ? [] : splited;
                        
                        obj['tags'] = checked;
                    }
                    
                    if (modifiedFieldValue === 'leaveAsIs'){
                        obj.extra[key] = importedSubscriber[key];
                    }
                }
            }
            
            subscribersListForSave.push({
                ...obj,
                extra: JSON.stringify(obj.extra)
            })
        })
        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/subscribers/importSubscribers`,
            method: 'post',
            request: {
                areSubscribers: model.areSubscribers,
                subscribers: subscribersListForSave,
                tags: tags
            },
            successCallback: (response) => {
                dispatch(setShouldReload({reload: true}))
                setLoading(false);
                
                if (response.isSuccess){
                    dispatch(setSubscriberManagementDrawerState({
                        ...state,
                        importOpened: false
                    }))   
                }else {
                    setImportErrorMessage(response.errorMessage)
                }
            },
            errorCallback: () => { }
        })
    };

    const handleCancel = () => {
        dispatch(setSubscriberManagementDrawerState({
            ...state,
            importOpened: false
        }))
    };

    // const RowsValidity = () => {
    //     let valid = 0;
    //     let invalid = 0;
    //    
    //     model.importedSubscribers.forEach(x => {
    //         const isValidEmail = validateEmail(x.email)
    //         if (isValidEmail){
    //             valid = valid + 1
    //         }else{
    //             invalid = invalid + 1
    //         }
    //     })
    //     return <>
    //         <Row>
    //             <Col span={24}>
    //                 <span>Valid: {valid}</span>
    //             </Col>
    //         </Row>
    //         <Row>
    //             <Col span={24}>
    //                 <span>Invalid: {invalid}</span>
    //             </Col>
    //         </Row>
    //     </>
    // }
    
    return <>
        <Modal
            visible={state.importOpened}
            title="Import Contacts"
            width={900}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    Continue
                </Button>,
            ]}>
            <Row>
                <Col style={{marginTop: 3}} span={11}>
                    <Text>The contacts you import are:</Text>
                </Col>
                <Col span={10}>
                    <Select
                        style={{width: '100%'}}
                        placeholder="Is Subscriber"
                        onChange={val => setModel({
                            ...model,
                            areSubscribers: val
                        })}
                        value={model.areSubscribers}>
                        {subscriberTypeOptions.map((x) => <Select.Option key={x.id} value={x.id}>{x.name}</Select.Option>)}
                    </Select>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col style={{marginTop: 3}} span={11}>
                    <Text>The contacts relate to these tags:</Text>
                </Col>
                <Col span={10}>
                    <Tags />
                </Col>
            </Row>
            <Divider orientation="left" plain>Import</Divider>
            <Row style={{marginTop: 10}}>
                <Col span={10}>
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>
                    <ImportedContacts 
                        loading={loading} 
                        importedSubscribers={model.importedSubscribers} />
                </Col>
                <Col span={24}>
                    {importErrorMessage.length > 0 ? 
                        <Alert 
                            style={{marginTop: 10}} 
                            type="error" 
                            showIcon 
                            message="Error" 
                            description={importErrorMessage} /> : ''}
                </Col>
                {/*<Col style={{marginTop: 10, marginLeft: 5}}>*/}
                {/*    <RowsValidity />*/}
                {/*</Col>*/}
            </Row>
        </Modal>
    </>
}

export default ImportSubscribers;