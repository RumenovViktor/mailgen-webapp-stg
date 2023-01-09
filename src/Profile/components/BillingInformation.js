import React, {useEffect, useState} from "react";
import StripeCheckout from "./StripeCheckout";
import {useAuth0} from "@auth0/auth0-react";
import taxOptions from "../../utils/taxOptions";
import Tiers from "./Tiers";
import {CardElement} from "@stripe/react-stripe-js";
import {callApi} from "../../utils/apiHelper";
import {Alert, Card, Checkbox, Col, Input, Row, Select, Spin, message} from "antd";
import { getAllCountries } from "../../utils/contriesProvider";

const BillingInformation = () => {
    const {getAccessTokenSilently} = useAuth0();

    const [failed, setFailed] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [tiers, setTiers] = useState([])
    const [taxTypePlaceholder, setTypePlaceholder] = useState('')
    const [upgradeDisabled, setUpgradeDisabled] = useState(true)
    const [discountChecked, setDiscountChecked] = useState(false);
    const [validationState, setValidationState] = useState({})
    const [billingInfo, setBillingInfo] = useState({
        taxCodeIndex: '',
        businessName: '',
        taxId: '',
        taxCode: '',
        addressCountry: null,
        addressCity: '',
        addressLine1: '',
        addressLine2: '',
        addressPostalCode: '',
        addressState: '',
        numberOfSubscribers: 5000,
        amount: '$20',
        discountCode: null
    })
    const [discount, setDiscount] = useState()
    const [buttonsAvailability, setButtonsAvailability] = useState({
        updateCustomerDetailsDisabled: false
    })

    const getTaxCodeData = (value) => {
        const taxData = taxOptions.taxData.filter(x => {
            return x.Id === value
        })[0]

        setTypePlaceholder(taxData.Example)
        return taxData
    }

    const setTaxCodeData = (value) => {
        const taxData = taxOptions.taxData.filter(x => {
            return x.Id === value
        })[0]

        setBillingInfo({
            ...billingInfo,
            taxCodeIndex: value,
            taxCode: taxData.TaxCode
        })

        setTypePlaceholder(taxData.Example)
    }

    const getPrices = async () => {
        const options = {
            url: `${process.env.REACT_APP_API_BASE}/prices/get`,
            method: 'get',
            successCallback: (response) => {
                setTiers(response)
            },
            errorCallback: (err) => {
                console.log(err.message)
            }
        }

        await callApi(getAccessTokenSilently, options)
    }

    const getCustomerDetails = async () => {
        const options = {
            url: `${process.env.REACT_APP_API_BASE}/customer/get/business`,
            method: 'get',
            successCallback: (response) => {
                const businessDetails = response.businessDetails;
                const discountCodeInfo = response.discount;

                const taxCodeData = getTaxCodeData(1)

                setBillingInfo({
                    ...billingInfo,
                    taxCodeIndex: 1,
                    taxCode: taxCodeData.TaxCode
                })

                if(businessDetails){
                    const taxCodeData = getTaxCodeData(!businessDetails.tax ? 1 : businessDetails.tax.taxCodeIndex)

                    setBillingInfo({
                        taxId: !businessDetails.tax ? '' : businessDetails.tax.id,
                        businessName: businessDetails.businessName,
                        taxCodeIndex: !businessDetails.tax ? 1 : businessDetails.tax.taxCodeIndex,
                        taxCode: taxCodeData.TaxCode,
                        addressCountry: businessDetails.address ? businessDetails.address.countryCode : null,
                        addressCity: businessDetails.address ? businessDetails.address.city : '',
                        addressLine1: businessDetails.address ? businessDetails.address.addressLine1 : '',
                        addressLine2: businessDetails.address ? businessDetails.address.addressLine2 : '',
                        addressPostalCode: businessDetails.address ? businessDetails.address.postalCode : '',
                        addressState: businessDetails.address ? businessDetails.address.state : '',
                    })

                    const customerCreated = businessDetails.businessName !== null && businessDetails.businessName.length !== 0;
                    setUpgradeDisabled(!customerCreated || !response.cardAdded);
                }
                if(discountCodeInfo){
                    setDiscount(!discountCodeInfo.codeId ? null : discountCodeInfo);
                }

                setLoading(false);
            },
            errorCallback: (err) => {
                console.log(err.message)
            }
        }

        await callApi(getAccessTokenSilently, options)
    }

    const confirmCard = async (clientSecret, stripe, elements, paymentMethod) => {
        const confirmResponse = await stripe.confirmCardSetup(clientSecret, {
            payment_method: paymentMethod.id
        })

        if (confirmResponse.setupIntent.status === 'succeeded') {
            const options = {
                url: `${process.env.REACT_APP_API_BASE}/customer/paymentmethod/confirm`,
                method: 'post',
                successCallback: (response) => {
                    setUpgradeDisabled(false)
                },
                errorCallback: (err) => {
                    setFailed(true)
                }
            }

            return await callApi(getAccessTokenSilently, options)
        }
    }

    const validateBillingDetails = () => {
        debugger
        const currentValidationResult = {};
        const businessNameValid = billingInfo.businessName && billingInfo.businessName.length !== 0;

        if (!businessNameValid){
            currentValidationResult['businessName'] = true;
        }else{
            currentValidationResult['businessName'] = false;
        }
        
        const countryCodeIsValid = billingInfo.addressCountry && billingInfo.addressCountry.length !== 0;

        if (!countryCodeIsValid){
            currentValidationResult['addressCountry'] = true;
        }else{
            currentValidationResult['addressCountry'] = false;
        }

        const addressCity = billingInfo.addressCity && billingInfo.addressCity.length !== 0;
        if (!addressCity){
            currentValidationResult['addressCity'] = true;
        }else{
            currentValidationResult['addressCity'] = false;
        }

        const addressLine1 = billingInfo.addressLine1 && billingInfo.addressLine1.length !== 0;
        if (!addressLine1){
            currentValidationResult['addressLine1'] = true;
        }else{
            currentValidationResult['addressLine1'] = false;
        }

        const addressPostalCode = billingInfo.addressPostalCode && billingInfo.addressPostalCode.length !== 0;
        if (!addressPostalCode){
            currentValidationResult['addressPostalCode'] = true;
        }else{
            currentValidationResult['addressPostalCode'] = false;
        }

        setValidationState(currentValidationResult)

        return Object.values(currentValidationResult).every(x => !x);
    }

    const updateBillingDetails = async (paymentMethodResponse, stripe, elements) => {
        debugger
        if(!validateBillingDetails()){
            setButtonsAvailability({...buttonsAvailability, updateCustomerDetailsDisabled: false})
            return;
        }

        const data = {
            businessName: billingInfo.businessName,
            taxCodeIndex: billingInfo.taxCodeIndex,
            taxId: billingInfo.taxId,
            taxCode: billingInfo.taxCode,
            paymentMethod: paymentMethodResponse.paymentMethod ? paymentMethodResponse.paymentMethod.id : null,
            discountCode: discountChecked ? billingInfo.discountCode : null,
            address: {
                countryCode: billingInfo.addressCountry,
                city: billingInfo.addressCity,
                addressLine1: billingInfo.addressLine1,
                addressLine2: billingInfo.addressLine2,
                postalCode: billingInfo.addressPostalCode,
                state: billingInfo.addressState,
            }
        }

        const options = {
            url: `${process.env.REACT_APP_API_BASE}/customer/update/business`,
            method: 'post',
            request: data,
            successCallback: (response) => {
                setButtonsAvailability({...buttonsAvailability, updateCustomerDetailsDisabled: false})
                if(response.status == 400){
                    messageApi.open({
                        type: 'error',
                        content: response.message,
                    });
                    return;
                }
                if (paymentMethodResponse.paymentMethod !== undefined && paymentMethodResponse.paymentMethod !== null) {
                    confirmCard(response.clientSecret, stripe, elements, paymentMethodResponse.paymentMethod)
                }

                if(response.discount){
                    setDiscount(response.discount)
                }
            },
            errorCallback: (err) => {
                console.log(err)
                setFailed(true)
                setButtonsAvailability({...buttonsAvailability, updateCustomerDetailsDisabled: false})
            }
        }

        return await callApi(getAccessTokenSilently, options)
    }

    const updateCustomerDetails = async (event, elements, stripe) => {
        event.preventDefault()

        const paymentMethodResponse = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })

        if (paymentMethodResponse.error && paymentMethodResponse.error.type !== 'validation_error') {
            setFailed(true)
            setErrorMessage(paymentMethodResponse.error.message)
            return
        }

        await updateBillingDetails(paymentMethodResponse, stripe, elements)
    }

    const formatTaxCode = (taxCode) => {
        return taxCode.replaceAll('_', ' ').toUpperCase()
    }

    const getTaxSelectMenu = () => {
        return taxOptions.taxOptions.map(x => {
            return <Select.Option value={x.Index}>
                {x.Text + ' - ' + formatTaxCode(x.Id)}
            </Select.Option>
        })
    }

    const getCountriesSelectMenu = () => {
        const allCountries = getAllCountries();
        return allCountries.map(x => {
            return <Select.Option value={x.CountryCode}>
                {x.CountryName}
            </Select.Option>
        })
    }

    useEffect(() => {
        getPrices()
        getCustomerDetails()
    }, [])

    return <>
        <Spin spinning={loading}>
            {contextHolder}
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title="Invoice Settings">
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Input
                                            status={!validationState.businessName ? '' : 'error'}
                                            placeholder="Business Name"
                                            value={billingInfo.businessName}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, businessName: event.target.value})
                                            }}/>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Select
                                            style={{float: 'left', width: '100%', textAlign: 'left'}}
                                            value={billingInfo.taxCodeIndex}
                                            onChange={(x) => setTaxCodeData(x)}>
                                            {getTaxSelectMenu()}
                                        </Select>
                                    </Col>
                                    <Col span={12}>
                                        <Input
                                            value={billingInfo.taxId}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, taxId: event.target.value})
                                            }}
                                            placeholder={taxTypePlaceholder}/>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Select
                                            status={!validationState.addressCountry ? '' : 'error'}
                                            placeholder='Country'
                                            style={{float: 'left', width: '100%', textAlign: 'left'}}
                                            value={billingInfo.addressCountry}
                                            onChange={(val) => setBillingInfo({...billingInfo, addressCountry: val})}
                                            >
                                            {getCountriesSelectMenu()}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Input
                                            status={!validationState.addressCity ? '' : 'error'}
                                            value={billingInfo.addressCity}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, addressCity: event.target.value})
                                            }}
                                            placeholder={'City'}/>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Input
                                            status={!validationState.addressLine1 ? '' : 'error'}
                                            value={billingInfo.addressLine1}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, addressLine1: event.target.value})
                                            }}
                                            placeholder={'Address Line 1'}/>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Input
                                            value={billingInfo.addressLine2}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, addressLine2: event.target.value})
                                            }}
                                            placeholder={'(Optional) Address Line 2'}/>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Input
                                            status={!validationState.addressPostalCode ? '' : 'error'}
                                            value={billingInfo.addressPostalCode}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, addressPostalCode: event.target.value})
                                            }}
                                            placeholder={'Postal Code'}/>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Input
                                            value={billingInfo.addressState}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, addressState: event.target.value})
                                            }}
                                            placeholder={'(Optional) State'}/>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col>
                                        <Checkbox checked={discountChecked} onChange={x => setDiscountChecked(x.target.checked)}>
                                            I have a discount code
                                        </Checkbox>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 10}} gutter={[16, 16]}>
                                    <Col span={18}>
                                        <Input
                                            value={billingInfo.discountCode}
                                            disabled={!discountChecked}
                                            onChange={(event) => {
                                                setBillingInfo({...billingInfo, discountCode: event.target.value})
                                            }}
                                            placeholder={'Enter your discount code...'}/>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}} gutter={[16,16]}>
                        <Col span={24}>
                            <Card title="Payment Details">
                                <Row>
                                    <Col span={24}>
                                        <Alert
                                            message="Provide a card number only in case you want to change your current billing card.">  </Alert>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <StripeCheckout
                                            submitDisabled={buttonsAvailability.updateCustomerDetailsDisabled}
                                            submitAction={async (event, elements, stripe) => {
                                                setButtonsAvailability({
                                                    ...buttonsAvailability,
                                                    updateCustomerDetailsDisabled: true
                                                })
                                                await updateCustomerDetails(event, elements, stripe)
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={16}>
                    <Tiers discount={discount} setDiscount={setDiscount} upgradeDisabled={upgradeDisabled} tiers={tiers}/>
                </Col>
            </Row>
        </Spin>
    </>
}

export default BillingInformation