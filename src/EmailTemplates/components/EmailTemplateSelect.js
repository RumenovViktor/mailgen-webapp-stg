import React from 'react';
import {Button, Dropdown, Menu} from "antd";
import {DragOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
const menu = (
    <Menu
        items={[
            {
                key: '1',
                icon: <FormOutlined />,
                label: (
                    <a target="_blank" rel="noopener noreferrer" href="/simple-template">
                        Create a simple template
                    </a>
                ),
            },
            {
                key: '2',
                icon: <DragOutlined />,
                label: (
                    <a target="_blank" rel="noopener noreferrer" href="/drag-and-drop   ">
                        Drag & Drop Builder
                    </a>
                ),
            }
        ]}
    />
);

const EmailTemplateSelect = () => {
    return <>
        <Dropdown
            overlay={menu}
            placement="bottom"
            arrow={{
                pointAtCenter: true,
            }}
        >
            <Button icon={<PlusOutlined />}>Create</Button>
        </Dropdown>
    </>
}

export default EmailTemplateSelect;