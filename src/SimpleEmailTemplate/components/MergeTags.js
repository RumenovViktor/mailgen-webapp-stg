import React, {useState} from "react";
import {Button, List, Modal} from "antd";

const data = [
    {
        title: '{{FIRST_NAME}}',
        description: "First Name of the subscriber which was captured during subscribe. If the subscriber is missing this information, it will be skipped. Additionally you can use the following format {{FIRST_NAME or 'great person'}}"
    },
    {
        title: '{{LAST_NAME}}',
        description: "Last Name of the subscriber which was captured during subscribe. If the subscriber is missing this information, it will be skipped. Additionally you can use the following format {{LAST_NAME or 'great person'}}"
    }
];

const MergeTags = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    
    return <>
        <Button onClick={showModal} shape="round">View Merge Tags</Button>
        <Modal title="Merge Tags" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <span>The merge tags use the famous Handlebars template format for replacement logic.</span>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<span>{item.title}</span>}
                            description={item.description}
                        />
                    </List.Item>
                )} />
        </Modal>
    </>
}

export default MergeTags;