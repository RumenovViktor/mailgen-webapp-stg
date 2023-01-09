import React from 'react';
import {ReportTitle} from "../../reportComponents/CampaignStyles";
import {Button, Dropdown, Menu, Space, Tooltip} from "antd";
import {MoreOutlined, RedoOutlined, ExportOutlined, ImportOutlined} from "@ant-design/icons";
import styled from 'styled-components';
import {setShouldReload} from "../../features/subscribers/reloadAudienceReportSlice";
import {useDispatch, useSelector} from "react-redux";
import {setSubscriberManagementDrawerState} from "../../features/subscribers/subscriberManagementDrawerSlice";
import {useAuth0} from "@auth0/auth0-react";
import {callApi} from "../../utils/apiHelper";
import {ExportToCsv} from "export-to-csv";

const Container = styled.div`
`;

const LeftContainer = styled.div`
`;

const RightContainer = styled.div`
    float:right
`;

const AudienceReportHeader = () => {
    const dispatch = useDispatch()
    const subscribersManagerDrawerState = useSelector(x => x.subscriberManagementDrawer)
    const {getAccessTokenSilently} = useAuth0();
    
    const onImportClick = () => {
        dispatch(setSubscriberManagementDrawerState({
            ...subscribersManagerDrawerState,
            importOpened: true
        }))
    }
    
    const downloadAudience = (audience) => {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
            filename: 'Export Audience'
        };
        
        const csvExporter = new ExportToCsv(options);

        let modifiedAudience = audience.map(x => {
            const extraParamsObject = JSON.parse(x.extra)
            const birthday = `${x.dayOfBirth}/${x.monthOfBirth}`;
            
            const modifiedObj = {
                ...x,
                ...extraParamsObject,
                tags: x.tags.join(','),
                birthday: !x.dayOfBirth || !x.monthOfBirth ? null : birthday
            };

            delete modifiedObj.extra
            delete modifiedObj.dayOfBirth
            delete modifiedObj.monthOfBirth
            
            return modifiedObj;
        })
        
        debugger
        csvExporter.generateCsv(modifiedAudience);
    }

    const exportAudience = async () => {
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/subscribers/all`,
            method: 'get',
            successCallback: downloadAudience,
            errorCallback: (error) => {}
        })
    }
    
    const menu = (
        <Menu
            items={[
                {
                    label: <a onClick={exportAudience}>Export</a>,
                    key: '0',
                    icon: <ExportOutlined />
                },
                {
                    label: <a onClick={onImportClick}>Import</a>,
                    key: '1',
                    icon: <ImportOutlined />
                }
            ]}
        />
    );
    
    return <>
        <Container>
            <LeftContainer>
                <ReportTitle>Audience</ReportTitle>
            </LeftContainer>
            <RightContainer>
                <Space>
                    <Tooltip title="Refresh">
                        <Button onClick={() => dispatch(setShouldReload({reload: true})) } shape="circle" icon={<RedoOutlined />} />
                    </Tooltip>
                    <Tooltip title="More Actions">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Button shape="circle" icon={<MoreOutlined />} />
                            </a>
                        </Dropdown>
                    </Tooltip>
                </Space>
            </RightContainer>
        </Container>
    </>
}

export default AudienceReportHeader;