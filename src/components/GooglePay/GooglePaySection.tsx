"use client"

import React from 'react'
import GooglePayButton from '@google-pay/button-react';
import GooglePayService from '@/services/google-pay.service';

export default function GooglePaySection() {
    const onLoadPaymentData = async (paymentData: any) => {
        console.log('load payment data', paymentData);

        try {
            const result = await GooglePayService.chargePayment({
                "orderId": "1234",
                "amount": 100,
                "paymentToken": paymentData.paymentMethodData.tokenizationData.token
            })
            return result;
        } catch (error) {
            console.error('Error charging payment', error);
            throw error;
        }
    };

    return (
        <div>
            <GooglePayButton
                environment="TEST"
                paymentRequest={{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                        {
                            type: 'CARD',
                            parameters: {
                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                allowedCardNetworks: ['MASTERCARD', 'VISA'],
                            },
                            tokenizationSpecification: {
                                type: 'PAYMENT_GATEWAY',
                                parameters: {
                                    gateway: 'example',
                                    gatewayMerchantId: 'exampleGatewayMerchantId',
                                },
                            },
                        },
                    ],
                    merchantInfo: {
                        merchantId: '12345678901234567890',
                        merchantName: 'Demo Merchant',
                    },
                    transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: '100.00',
                        currencyCode: 'USD',
                        countryCode: 'US',
                    },
                }}
                onLoadPaymentData={data => onLoadPaymentData(data)}
            /></div>
    )
}
