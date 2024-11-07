'use client'
import { PayPalButtons, PayPalScriptProvider, PayPalButtonsComponentProps, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { useAddPaymentMutation } from '@/redux/features/pay/paySlice';
import { Address } from '@/lib/type';
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
    const [addPayment] = useAddPaymentMutation()
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
        alert("Transaction completed by ")
        const response = await addPayment({
            wallet: details?.purchase_units?.[0].custom_id as Address,
            amount: details?.purchase_units?.[0]?.amount?.value,
            currency: details?.purchase_units?.[0]?.amount?.currency_code,
            order_id: details?.id,
            invoice_id: details?.purchase_units?.[0].invoice_id,
            payer_email: details?.payer?.email_address,
            payee_email: details?.purchase_units?.[0]?.payee?.email_address,

        })

        console.log(response)
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