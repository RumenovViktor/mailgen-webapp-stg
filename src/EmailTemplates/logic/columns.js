import {formatDate} from "../../utils/dateFormatter";
import React from "react";
import {Button, Tag} from "antd";
import {EditOutlined} from "@ant-design/icons";

export const columns = {
    getTemplatesReportColumns: (openEmailTemplateUpdate) => {
        return [
            {
                dataIndex: 'name',
                title: 'Name',
                key: 'name'
            },
            {
                dataIndex: 'createdOn',
                title: 'Created Date',
                key: 'date',
                render: (value) => {
                    return formatDate({value: value})
                }
            },
            {
                dataIndex: 'templateType',
                title: 'Type',
                key: 'templateType',
                render: (value) => {
                    if (value === 0) {
                        return <Tag color="#2db7f5">Simple Template</Tag>
                    }
                    if (value === 1) {
                        return <Tag color="#9C27B0">Drag & Drop</Tag>
                    }
                }
            },
            {
                dataIndex: 'modify',
                title: 'Modify',
                key: 'modify',
                render: (val, {id, templateType}) => {
                    debugger
                    return <>
                        <Button
                            type="circle"
                            onClick={(x) => openEmailTemplateUpdate(id, templateType)}
                            icon={<EditOutlined />}
                        />
                    </>
                }
            }];
    }
}

export const {getTemplatesReportColumns} = columns;