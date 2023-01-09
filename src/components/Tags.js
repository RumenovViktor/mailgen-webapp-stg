import React, {useEffect, useState} from 'react'
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../config";
import {Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {updateSelectedTags} from "../features/tagsSlice";

const Tags = (props) => {
    const {customReload, status, disabledTags} = props;
    const dispatch = useDispatch();
    const selectedTags = useSelector(selector => selector.tags)
    const [tagsSource, setTagsSource] = useState([])
    const {getAccessTokenSilently} = useAuth0();

    const config = getConfig()

    const callApi = async () => {
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });

        fetch(`${process.env.REACT_APP_API_BASE}/tags/getTags`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(response => {
                setTagsSource(response)
            })
            .catch(x => console.log(x.message))
    }

    useEffect(() => callApi(), [])

    useEffect(() => {
        if (customReload){
            callApi()
        }
    }, [customReload])

    return <>
        <Select
            status={status ? status : ""}
            mode="tags" 
            style={{ width: '100%', textAlign: 'left' }} 
            placeholder="Select Tags..."
            value={selectedTags}
            onChange={(selected) => {
                dispatch(updateSelectedTags(selected))
            }}
        >
            {tagsSource.map((x, index) => {
                if (!disabledTags){
                    return <Select.Option value={x} key={index}>{x}</Select.Option>;
                }
                return <Select.Option disabled={disabledTags.includes(x)} value={x} key={index}>{x}</Select.Option>;
            })}
        </Select>
    </>
}

export default Tags