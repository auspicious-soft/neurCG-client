import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

interface CheckoutFormProps {
    userId: string;
    planType: string;
    clientSecret: string;
}

const CheckoutForm = ({ userId, planType, clientSecret }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js hasn't loaded yet
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3001/plans", // Change this to your return URL
            },
        });

        if (result.error) {
            console.error(result.error.message); // Show error to your customer
        } else {
            console.log('Payment successful!', result); // Handle successful payment
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type="submit" disabled={!stripe}>Pay</button>
        </form>
    );
};

export default CheckoutForm;