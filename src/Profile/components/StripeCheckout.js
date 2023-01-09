import React from 'react'

import {
    Elements
} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import StripeCheckoutForm from "./StripeCheckoutForm";

const StripeCheckout = (props) => {
    const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`)
    
    return <>
        <Elements stripe={stripePromise}>
            <StripeCheckoutForm {...props} />
        </Elements>
    </>
}

export default StripeCheckout