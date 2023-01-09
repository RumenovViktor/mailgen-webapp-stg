import {Table} from 'antd';
import React, {useState} from 'react';
import {ContainerWrapper, ReportTitle} from "../../reportComponents/CampaignStyles";
import {SelectOutlined} from "@ant-design/icons";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, {id, name}) => {
            const url = `${process.env.REACT_APP_BASE_URL}/campaign?mode=update&campaignId=${id}`
            return <a target="_blank" style={{textDecoration: 'none', color: '#009be5'}} href={url}>{name} &nbsp; <SelectOutlined /></a>
        },
    },
    {
        title: 'Emails Sent',
        dataIndex: 'emailsSent',
        key: 'emailsSent',
        render: (text) => {
            return `${text}`;
        }
    },
    {
        title: 'Template Type',
        key: 'emailTemplateType',
        dataIndex: 'emailTemplateType',
        render: (value) => value == 0 ? 'Simple Template' : 'Drag & Drop Builder'
    },
    {
        title: 'Template',
        key: 'emailTemplateName',
        render: (_, {emailTemplateType, emailTemplateId, emailTemplateName}) => {
            const emailTemplateTypeUrl = emailTemplateType == 0 ? 'simple-template' : 'template';
            const url = `${process.env.REACT_APP_BASE_URL}/${emailTemplateTypeUrl}?mode=update&id=${emailTemplateId}`
            return <a target="_blank" href={url}>
                {emailTemplateName} &nbsp;
                <SelectOutlined />
            </a>
        },
    },
];

const AutoEmailsDashboardReport = (props) => {
    const {rows, loading} = props

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5
    })

    const onTableChange = (newPagination) => {
        setPagination({...newPagination})
    }

    return <>
        <ContainerWrapper>
            <Table
                title={() => <ReportTitle>Automated Emails</ReportTitle>}
                loading={loading}
                columns={columns}
                dataSource={rows}
                pagination={pagination}
                onChange={onTableChange}
            />
        </ContainerWrapper>
    </>
}

export default AutoEmailsDashboardReport;