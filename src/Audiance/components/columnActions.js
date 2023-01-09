import React from "react";
import {Button, Dropdown, Menu} from "antd";
import {MoreOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {addSubscribersForDelete} from "../../features/subscribers/selectedSubscribersForDelete";
import {updateSubscriberDetailsDrawer} from "../../features/subscribers/subscriberDetailsDrawer";

const ColumnActions = (props) => {
    const {subscriberId} = props;
    const dispatch = useDispatch()
    
    const onDelete = () => {
        dispatch(addSubscribersForDelete({
            openWarning: true,
            audience: [subscriberId]
        }))
    }
    
    const onEdit = () => {
        dispatch(updateSubscriberDetailsDrawer({
            drawerOpened: true,
            subscriberId: subscriberId
        }))
    }
    
    const menu = (
        <Menu
            items={[
                {
                    label: <a onClick={onEdit}>Update</a>,
                    key: '0',
                    icon: <EditOutlined />
                },
                {
                    label: <a onClick={onDelete}>Delete</a>,
                    key: '1',
                    icon: <DeleteOutlined />,
                    danger: true
                }
            ]}
        />
    );
    
    return <>
        <Dropdown overlay={menu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
                <Button shape="circle" icon={<MoreOutlined />} />
            </a>
        </Dropdown>
    </>
}

export default ColumnActions;