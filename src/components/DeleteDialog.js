import React from 'react';
import {useAuth0} from "@auth0/auth0-react";
import {useDispatch, useSelector} from "react-redux";
import {resetAddedSubscriberForDelete} from "../features/subscribers/selectedSubscribersForDelete";
import {callApi} from "../utils/apiHelper";
import {setShouldReload} from "../features/subscribers/reloadAudienceReportSlice";
import {Modal} from "antd";

const DeleteDialog = () => {

    const {getAccessTokenSilently} = useAuth0();
    const selector = useSelector(x => x.selectedSubscribersForDelete)
    const dispatch = useDispatch();

    const onExecute = async () => {
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/subscribers/deleteSubscriber`,
            method: 'post',
            request: {
                id: selector.audience[0]
            },
            successCallback: (response) => {
                onClose();
                dispatch(setShouldReload({reload: true}))
            }
        })
    }

    const onClose = () => {
        dispatch(resetAddedSubscriberForDelete())
    }

    const executeAndClose = async () => {
        onClose();
        await onExecute();
    };

    return (
        <div>
            <Modal okButtonProps={{ danger: true }} title="Delete" visible={selector.openWarning} onOk={executeAndClose} onCancel={onClose}>
                <span>
                    This action will remove this record forever. It is not reversable.
                    Are you sure you want to proceed? 
                </span>
            </Modal>
        </div>
    );
}

export default DeleteDialog