import React, {useEffect, useState} from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import {Button, Tooltip} from "antd";
import {PlayCircleOutlined, StopOutlined} from "@ant-design/icons";
import {callApi} from "../../utils/apiHelper";

const CampaignActivation = (props) => {
    const { 
        params
    } = props

    const buttonTypes = Object.freeze({
        Start: 1,
        Stop: 2,
        Ended: 4
    })

    const [activeButton, setActiveButton] = useState(params.row.state)
    const { getAccessTokenSilently } = useAuth0();
    
    useEffect(() => {
        if(params.row.state === buttonTypes.Start){
            setActiveButton(buttonTypes.Stop)
        }else{
            setActiveButton(buttonTypes.Start)   
        }
    }, [params.row.state])
    

    const onStart = async () => {        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/campaigns/startCampaign?campaignId=${params.row.id}`,
            method: 'post',
            request: {},
            successCallback: () => {
                setActiveButton(buttonTypes.Stop)
            },
            errorCallback: () => {}
        })
    }

    const onStop = async () => {        
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/campaigns/stopCampaign?campaignId=${params.row.id}`,
            method: 'post',
            request: {},
            successCallback: (response) => {
                if (props.params.row.type == 1){
                    setActiveButton(buttonTypes.Ended)
                }else{
                    setActiveButton(buttonTypes.Start)
                }
            },
            errorCallback: () => {}
        })
    }

    const renderButton = () => {
        switch(activeButton) {
            case buttonTypes.Stop:
                return <>
                        <Tooltip title="Stop Campaign">
                            <Button
                                type='circle'
                                onClick={onStop}
                                icon={<StopOutlined />}
                            />
                        </Tooltip>
                    </>
            case buttonTypes.Start:
                return <>
                    <Tooltip title="Start Campaign">
                        <Button
                            type='circle'
                            onClick={onStart}
                            icon={<PlayCircleOutlined />}
                        />
                    </Tooltip>
                </>
            case buttonTypes.Ended:
                return <>
                    <p>Ended</p>
                </>
            default:
                console.error("Option not supported")
        }
    }

    return <>
        {renderButton()}
    </>
}

export default CampaignActivation