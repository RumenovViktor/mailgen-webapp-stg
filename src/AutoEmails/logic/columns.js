import {formatDate} from "../../utils/dateFormatter";
import React from "react";
import {Button} from "antd";
import {EditOutlined} from "@ant-design/icons";

export const columns = {
    getAutoEmailsReportColumns: (openAutoEmailUpdate) => {
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
                render: (params) => {
                    return "Welcome Email"
                }
            },
            {
                dataIndex: 'createdDate',
                title: 'Created Date',
                key: 'date',
                render: (value) => {
                    return formatDate({value: value})
                }
            },
            {
                dataIndex: 'modify',
                title: 'Modify',
                key: 'modify',
                render: (val, {id}) => {
                    return <>
                        <Button
                            type="circle"
                            onClick={(x) => openAutoEmailUpdate(id)}
                            icon={<EditOutlined />}
                        />
                    </>
                }
            }
        ];
    }
}

export const {getAutoEmailsReportColumns} = columns;