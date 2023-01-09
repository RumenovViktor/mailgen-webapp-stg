import React, {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Alert, Button, Card, Col, Row} from "antd";
import {callApi} from "../../utils/apiHelper";

const PasswordManagement = () => {
    const {getAccessTokenSilently} = useAuth0();
    
    const [resetPasswordDisabled, setResetPasswordDisabled] = useState(false)

    const onClick = async () => {
        setResetPasswordDisabled(true)
        await callApi(getAccessTokenSilently, {
            url: `${process.env.REACT_APP_API_BASE}/customer/changePassword`,
            method: 'post',
            request: {},
            successCallback: (data) => {
            },
            errorCallback: (error) => {
                setResetPasswordDisabled(false)
            }
        })
    }

    return <>
        <Card>
            <Row gutter={[16,16]}>
                <Col span={8}>
                    <Alert
                        message='By clicking the Send Password Reset Email button you will receive an email from which you can change your password.'
                        type="info"
                    />
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={8}>
                    <Button
                        type='primary'
                        disabled={resetPasswordDisabled}
                        onClick={() => onClick()}>
                        Send Password Reset Email
                    </Button>
                </Col>
            </Row>
        </Card>
    </>
}

export default PasswordManagement