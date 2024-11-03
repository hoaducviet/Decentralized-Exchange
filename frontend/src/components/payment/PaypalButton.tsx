'use client'
import { PayPalButtons, PayPalScriptProvider, PayPalButtonsComponentProps, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
};

const styles: PayPalButtonsComponentProps["style"] = {
    shape: "sharp",
    layout: "vertical",
    color: "gold",
};

const displayOnly: PayPalButtonsComponentProps["displayOnly"] = ["vaultable"];

interface Props {
    orderId: string;
}
export default function PaypalButton({ orderId }: Props) {
    const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
        try {
            if (orderId) {
                return orderId;
            } else {
                throw new Error("No order ID returned");
            }
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    };

    const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
        const details = await actions.order?.capture();
        console.log('Transaction completed by ' + details?.payer?.name?.given_name);
        alert("Transaction completed by ")
        window.location.assign("/success");

        // Bạn có thể xử lý thông tin thanh toán ở đây
    };

    const onCancel: PayPalButtonsComponentProps["onCancel"] = (data) => {
        console.log("Transaction canceled", data);
        // Show a cancel page, or return to cart
        window.location.assign("/your-cancel-page");
    }
    const onError: PayPalButtonsComponentProps["onError"] = (err) => {
        console.log("Transaction canceled", err);
        // For example, redirect to a specific error page
        window.location.assign("/your-error-page-here");
    }

    return (

        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                fundingSource='paypal'
                displayOnly={displayOnly}
                style={styles}
                createOrder={createOrder}
                onApprove={onApprove}
                onCancel={onCancel}
                onError={onError}
            />
        </PayPalScriptProvider>
    )
}