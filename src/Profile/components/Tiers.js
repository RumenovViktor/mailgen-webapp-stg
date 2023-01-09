import React, {useEffect, useState} from 'react'
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../../config";
import {Alert, Button, Card, Col, Input, Row} from "antd";
import {MinusOutlined, PlusOutlined, RocketOutlined} from "@ant-design/icons";
import moment from 'moment';
import RemoveDiscount from './RemoveDiscount';

const Tiers = (props) => {
    const {tiers, upgradeDisabled, discount, setDiscount} = props

    const {getAccessTokenSilently} = useAuth0();
    const config = getConfig()

    const [price, setPrice] = useState("-")
    const [discountPrice, setDiscountPrice] = useState('');
    const [subscribersVolume, setSubscribersVolume] = useState(5000)
    const [upgradeClicked, setUpgradeClicked] = useState(false)
    const [allowedEmails, setAllowedEmails] = useState(10000)

    const onVolumeChange = (volume) => {
        let price = tiers[0].flatAmount
        let emails = tiers[0].emails

        for (let index = 1; index < tiers.length; index++) {
            if (volume > tiers[index - 1].upTo && tiers[index].upTo === null){
                price = tiers[tiers.length - 1].flatAmount
                emails = tiers[tiers.length - 1].emails
                break;
            }
            
            if (volume > tiers[index - 1].upTo && volume <= tiers[index].upTo) {
                price = tiers[index].flatAmount
                emails = tiers[index].emails
            }
        }

        setSubscribersVolume(volume)
        setAllowedEmails(emails)
        const formattedPrice = price !== 0 ? `${price}`.substring(0, `${price}`.length - 2) : "-"
        setPrice(formattedPrice)

        if(discount){
            const discountLeftOver = new Number(price) * (new Number(discount.percentageOff) / 100);
            const formattedPrice = price !== 0 ? `${price - discountLeftOver}`.substring(0, `${price - discountLeftOver}`.length - 2) : "-"
            setDiscountPrice(formattedPrice)
        }
    }

    const getPriceView = () => {
        return price === '-' ? `${price}` : `$${price}`
    }

    const getDiscountPriceView = () => {
        return discountPrice === '-' ? `${discountPrice}` : `$${discountPrice}`
    }

    const callApi = async (options) => {
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user profile email openid",
        });

        fetch(options.uri, {
            method: options.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: options.data ? JSON.stringify(options.data) : null
        })
            .then(res => {
                return res.json()
            })
            .then(response => {
                if (response.status >= 400) {
                    options.errorHandler("")
                } else {
                    options.callback(response)
                }

                if (options.changeAvailability) {
                    options.changeAvailability(response)
                }
            })
            .catch(err => {
                options.errorHandler(err)
            })
    }

    const upgrade = async (event) => {
        event.preventDefault()
        setUpgradeClicked(true)
        const options = {
            uri: `${process.env.REACT_APP_API_BASE}/customer/upgrade`,
            method: 'post',
            data: {
                quantity: subscribersVolume
            },
            callback: (response) => {
                setUpgradeClicked(false)
            },
            errorHandler: (err) => {
                console.log(err.message)
            }
        }
        await callApi(options)
    }

    useEffect(() => {
        if(!tiers.length){
            setPrice("-")
            return;
        }

        const price = `${tiers[0].flatAmount}`.substring(0, `${tiers[0].flatAmount}`.length - 2)
        setPrice(price)
        
        if(discount){
            const flatAmount = tiers[0].flatAmount;
            const discountLeftOver = new Number(flatAmount) * (new Number(discount.percentageOff) / 100);
            const formattedPrice = price !== 0 ? `${flatAmount - discountLeftOver}`.substring(0, `${flatAmount - discountLeftOver}`.length - 2) : "-"
            setDiscountPrice(formattedPrice)
        }
    }, [tiers, discount])

    return <>
        <Card>
            {!discount ? '' : <>
                <Row gutter={[16,16]}>
                    <Col span={24}>
                        <Alert
                            style={{
                                textAlign: 'left',
                                fontSize: '16px'
                            }}
                            type="success"
                            showIcon
                            icon={<RocketOutlined />}
                            message={`You applied a discount code ${discount.code} for ${discount.percentageOff}% off all plans. Expires on ${moment(discount.expirationDate).format('MM/DD/YYYY')}`}
                            action={
                                <RemoveDiscount codeId={discount.codeId} setDiscount={setDiscount} />
                            }
                        />
                    </Col>
                </Row>
            </>}
            <Row gutter={[16,16]}>
                <Col span={24}>
                    <span style={{fontSize: !discount ? '50px' : '30px', fontWeight: 200, textDecoration: !discount ? 'none' : 'line-through'}}>{getPriceView()} </span>
                </Col>
                {!discount ? '' : <>
                    <Col span={24}>
                        <span style={{fontSize: '50px', fontWeight: 200}}>{getDiscountPriceView()} </span>
                    </Col>
                </>}
            </Row>
            <Row style={{marginTop: 10}} gutter={[16,16]}>
                <Col span={12}>
                    <Row>
                        <Col span={24}>
                            <span style={{fontSize: '20px'}}>Subscribers</span>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16,16]}>
                        <Col span={24}>
                            <Input
                                style={{textAlign: 'center'}}
                                value={subscribersVolume}
                                onChange={event => onVolumeChange(event.target.value)}
                                size="large"
                                addonBefore={<>
                                    <Button 
                                        icon={<MinusOutlined />} 
                                        type={"text"}
                                        onClick={() => {
                                            if (new Number(subscribersVolume) - 5000 >= 0){
                                                onVolumeChange(new Number(subscribersVolume) - 5000)   
                                            }else {
                                                onVolumeChange(0)
                                            }
                                        }} />
                                </>}
                                addonAfter={<>
                                    <Button 
                                        icon={<PlusOutlined />} 
                                        type={"text"}
                                        onClick={() => {
                                            debugger
                                            onVolumeChange(new Number(subscribersVolume) + 5000)
                                        }} />
                                </>}/>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row gutter={[16,16]}>
                        <Col span={24}>
                            <span style={{fontSize: '20px'}}>Emails</span>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16,16]}>
                        <Col span={24}>
                            <Input
                                style={{textAlign: 'center'}} 
                                size="large" 
                                disabled 
                                value={allowedEmails} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>
                    <Alert
                        message="In order to Upgrade your account, you first need to fill your invoice and payment details."
                    />
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>

                    <Button
                        shape="round" 
                        type="primary"
                        size="large"
                        loading={upgradeClicked}
                        disabled={upgradeDisabled || upgradeClicked}
                        onClick={(event) => upgrade(event)}>
                        Upgrade
                    </Button>
                </Col>
            </Row>
        </Card>
    </>
}

export default Tiers