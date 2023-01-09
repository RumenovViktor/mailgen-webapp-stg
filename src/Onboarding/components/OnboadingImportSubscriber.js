import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {Alert, Button, Col, Collapse, Divider, message, Row, Select, Table, Upload} from "antd";
import validateEmail from "../../utils/ValueValidations";
import Tags from "../../components/Tags";
import {UploadOutlined} from "@ant-design/icons";
import {ContainerWrapper} from "../../reportComponents/CampaignStyles";
import {getImportedContactsColumns} from "../../Audiance/logic/columns";
import * as React from "react";
import {updateOnboarding} from "../../features/onboarding/onboardingSlice";
import subscriberType from "../SubscriberType";
import {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {callApi} from "../../utils/apiHelper";
import {setShouldReload} from "../../features/subscribers/reloadAudienceReportSlice";
import {setSubscriberManagementDrawerState} from "../../features/subscribers/subscriberManagementDrawerSlice";
import ImportedContacts from "../../Audiance/components/importComponents/ImportedContacts";
const { Panel } = Collapse;

const subscriberTypeOptions = Object.freeze([{
    id: subscriberType.Subscribed,
    name: "Subscribers"
}, {
    id: subscriberType.NotSubscribed,
    name: "Not Subscribers"
}])

const Text = styled.span`
    // color: #1a3353;
    font-weight: 500;
    font-size: 15px;
`;

const OnboadingImportSubscriber = () => {
    const [loading, setLoading] = useState(false);
    const [importErrorMessage, setImportErrorMessage] = useState('')
    const [model, setModel] = useState({
        areSubscribers: subscriberType.Subscribed,
        importedSubscribers: []
    })

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

    return <>
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
    </>
}

export default OnboadingImportSubscriber;