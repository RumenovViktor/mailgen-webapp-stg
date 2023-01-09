import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import React from "react";
import {Button} from "antd";

const StripeCheckoutForm = (props) => {
    const stripe = useStripe();
    const elements = useElements()
    const {submitAction, submitDisabled} = props

    return (
        <form id="paymentForm" onSubmit={(event) => {
            debugger
            submitAction(event, elements, stripe)
        }}>
            <CardElement />
            <Button shape="round" htmlType="submit" type="primary" disabled={!stripe || submitDisabled}>Update</Button>
        </form>
    )
}

export default StripeCheckoutForm