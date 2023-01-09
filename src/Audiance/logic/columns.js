import {formatDate} from "../../utils/dateFormatter";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import ColumnActions from "../components/columnActions";
import React from "react";
import validateEmail from "../../utils/ValueValidations";
import FieldTypesSelect from "../components/importComponents/FieldTypesSelect";
import TextElement from "../../EmailBuilder/Elements/TextElement";
import {Badge, Space, Tag} from "antd";

export const audienceColumns = {
    getAudienceColumns: () => {
        return [
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                render: (_, {email, bounceStatus}) => {
                    debugger
                    let badgeText = '';
                    let color = '';

                    if (bounceStatus === 0) {
                        badgeText = 'Verified';
                        color = 'green';
                    }

                    if (bounceStatus === 1) {
                        badgeText = 'Soft Bounce';
                        color = 'orange';
                    }

                    if (bounceStatus === 2) {
                        badgeText = 'Hard Bounce';
                        color = 'red';
                    }

                    if (bounceStatus === 3) {
                        badgeText = 'Unverified';
                        color = 'grey';
                    }

                    return <>
                        <Space>
                            <span>{email}</span>
                            <Tag color={color}>{badgeText}</Tag>
                        </Space>
                    </>
                }                
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName'
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName'
            },
            {
                title: 'Date Subscribed',
                key: 'dateSubscribed',
                dataIndex: 'dateSubscribed',
                render: (value) => formatDate({value: value})
            },
            {
                title: 'Is Subscriber',
                key: 'isSubscribed',
                dataIndex: 'isSubscribed',
                render: (_, {isSubscribed}) => {
                    return isSubscribed ? <CheckOutlined style={{color: 'green'}}/> :
                        <CloseOutlined style={{color: 'red'}}/>;
                }
            },
            {
                title: 'Actions',
                key: 'isSubscribed',
                dataIndex: 'isSubscribed',
                render: (_, {id}) => {
                    return <ColumnActions subscriberId={id}/>;
                }
            },
        ];
    },
    getImportedContactsColumns: () => {
        return {
            email: (headerTitle) => {
                return {
                    title: () => {
                        return <>
                            <FieldTypesSelect disabled defaultSelected="email" />
                            <div style={{marginTop: 10, textAlign: 'center'}}>
                                <span>{headerTitle}</span>
                            </div>
                        </>
                    },
                    dataIndex: 'email',
                    key: 'email',
                    render: (_, {email}) => {
                        const isValid = validateEmail(email);
                        return <>
                            <span style={{color: !isValid ? "red" : ''}}>{email}</span>
                        </>
                    }
                }
            },
            getGeneric: (key) => {
                return {
                    title: () => {
                        return <>
                            <FieldTypesSelect
                                currentKey={key} 
                                defaultSelected="ignoreField" 
                            />
                            <div style={{marginTop: 10, textAlign: 'center'}}>
                                <span>{key}</span>
                            </div>
                        </>
                    },
                    dataIndex: key,
                    key: key
                }
            }
        }
    }
}

export const {getAudienceColumns, getImportedContactsColumns} = audienceColumns;