'use client'

import { PayPalButtons, PayPalScriptProvider, PayPalButtonsComponentProps, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';




const initialOptions: ReactPayPalScriptOptions = {
    clientId: "AVaEIV9iJjClKsxVEw2_4nus4NQ8d4mJIqq_SCDMXVOUA6hXz429CdeYRh382vefxdQrzazmun8ZKXnh",
    currency: "USD",
};

const styles: PayPalButtonsComponentProps["style"] = {
    shape: "sharp",
    layout: "vertical",
    color: "gold",


};

const displayOnly: PayPalButtonsComponentProps["displayOnly"] = ["vaultable"];

export default function PaypalButton() {


    const createOrder: PayPalButtonsComponentProps["createOrder"] = async (data, actions) => {
        return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: '20.00',
                    breakdown: {
                        item_total: { currency_code: "USD", value: "15.00" },
                        shipping: { currency_code: "USD", value: "5.00" },
                        handling: { currency_code: "USD", value: "2.00" },
                        tax_total: { currency_code: "USD", value: "3.00" },
                        discount: { currency_code: "USD", value: "5.00" }
                    }
                },
                items: [
                    {
                        name: "Sample Product",
                        description: "Description of Sample Product",
                        unit_amount: { currency_code: "USD", value: "7.50" },
                        quantity: "2",
                        category: "PHYSICAL_GOODS"
                    }
                ]
            }],
        }).then((orderId) => {
            return orderId; // Trả về orderId để hoàn tất đơn hàng
        });
    };

    const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
        const details = await actions.order?.capture();
        console.log('Transaction completed by ' + details?.payer?.name?.given_name);
        alert("Transaction completed by ")
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
        <div>
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
        </div>
    )
}