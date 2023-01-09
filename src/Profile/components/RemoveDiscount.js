import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Modal } from 'antd';
import React from 'react';
import { callApi } from '../../utils/apiHelper';
const { confirm } = Modal;

const RemoveDiscount = ({codeId, setDiscount}) => {
    const {getAccessTokenSilently} = useAuth0();

    const onDelete = async () => {
        const options = {
            url: `${process.env.REACT_APP_API_BASE}/customer/discounts/remove`,
            method: 'post',
            request: {
                codeId: codeId
            },
            successCallback: (response) => {
                setDiscount(null)
            },
            errorCallback: (err) => {
            }
        }

        return await callApi(getAccessTokenSilently, options)
    }

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to remove your current discount?',
            icon: <ExclamationCircleOutlined />,
            content: 'The proccess is irreversible, and you will not be able to use the same discount code again!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk () {
                try {
                    await onDelete();
                } catch {
                    return console.log('Oops errors!');
                }
            },
            onCancel() { },
        });
      };

    return <>
        <Button onClick={showDeleteConfirm} size="small" danger>Remove Discount</Button>
    </>
}

export default RemoveDiscount;