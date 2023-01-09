import CampaignActivation from "../components/CampaignActivation";
import {formatDate, formatDateTime} from "../../utils/dateFormatter";
import React from "react";
import {EditOutlined} from "@ant-design/icons";
import {Button, Tag} from "antd";

export const columns = {
    getCampaignColumns: (openCampaignUpdate) => {
        return [
            {
                dataIndex: 'name',
                title: 'Name',
                key: 'name'
            },
            {
                dataIndex: 'type',
                title: 'Type',
                key: 'type',
                render: (value) => {
                    if (value == 0) {
                        return <Tag color="#87d068">Newsletter</Tag> 
                    }
                    if (value == 1) {
                        return <Tag color="#2db7f5">Scheduled One-Time</Tag>
                    }
                }
            },
            {
                dataIndex: 'isActive',
                title: 'Active',
                key: 'isActive',
                render: (value, params) => {
                    debugger
                    if (params.state == 4){
                        return <span>Ended</span>
                    }
                    return <CampaignActivation params={{row: params}}/>;
                }
            },
            {
                dataIndex: 'createdDate',
                title: 'Created Date',
                key: 'createdDate',
                render: (value) => {
                    return formatDate({value: value})
                }
            },
            {
                dataIndex: 'endDate',
                title: 'End Date',
                key: 'endDate',
                render: (value) => {
                    if (!value) {
                        return '-'
                    }

                    return formatDateTime({value: value})
                }
            },
            {
                dataIndex: 'modify',
                title: 'Modify',
                key: 'modify',
                render: (_, {id}) => {
                    return <>
                        <Button
                            type="circle"
                            onClick={(x) => openCampaignUpdate(id)} 
                            icon={<EditOutlined />} 
                        />
                    </>
                }
            }
        ];
    }
}

export const {getCampaignColumns} = columns;