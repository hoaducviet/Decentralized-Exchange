'use client'
import { Dispatch, SetStateAction } from 'react';
import { PayPalButtons, PayPalScriptProvider, PayPalButtonsComponentProps, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { useAddPaymentMutation } from '@/redux/features/pay/paySlice';
import { Address } from '@/lib/type';
import API from '@/config/configApi'

const initialOptions: ReactPayPalScriptOptions = {
    clientId: API.paypalClientId!,
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
    setOpen: Dispatch<SetStateAction<boolean>>;
    percent: string;
}
export default function PaypalButton({ orderId, setOpen, percent }: Props) {
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
        await addPayment({
            wallet: details?.purchase_units?.[0].custom_id as Address,
            amount: details?.purchase_units?.[0]?.amount?.value,
            currency: details?.purchase_units?.[0]?.amount?.currency_code,
            order_id: details?.id,
            invoice_id: details?.purchase_units?.[0].invoice_id,
            payer_email: details?.payer?.email_address,
            payee_email: details?.purchase_units?.[0]?.payee?.email_address,
            percent_eth: percent,
            notes: "Buy token"
        })

        setOpen(false)
    };

    const onCancel: PayPalButtonsComponentProps["onCancel"] = (data) => {
        console.log("Transaction canceled", data);
        setOpen(false)

    }
    const onError: PayPalButtonsComponentProps["onError"] = (err) => {
        console.log("Transaction canceled", err);
        setOpen(false)
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