const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? 'http://localhost:3000';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject { [key: string]: JsonValue }

export interface ChargeRequest {
    amount: number;
    orderId: string; 
    paymentToken: JsonObject;
    metadata?: JsonObject;
}

export interface ChargeResponse {
    success: boolean;
    id?: string; // payment or charge id from backend
    status?: string;
    error?: string;
    [key: string]: any;
}

async function postJson<TRequest = unknown, TResponse = unknown>(
    path: string,
    body: TRequest,
    signal?: AbortSignal,
): Promise<TResponse> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
        credentials: 'omit',
    });

    const contentType = res.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!res.ok) {
        const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
        const message = payload && typeof payload === 'object' ? JSON.stringify(payload) : String(payload ?? res.statusText);
        throw new Error(`Request failed: ${res.status} ${message}`);
    }

    if (isJson) {
        return (await res.json()) as TResponse;
    }

    return (await res.text()) as unknown as TResponse;
}

const GooglePayService = {
    async chargePayment(payload: ChargeRequest, signal?: AbortSignal): Promise<any> {
        return postJson<ChargeRequest, any>('/google-pay/make-payment', payload, signal);
    },

    async createPaymentIntent(
        body: { amount: number; currency: string; metadata?: JsonObject },
        signal?: AbortSignal,
    ): Promise<{ clientSecret?: string; id?: string; error?: string }> {
        return postJson('/google-pay/create-intent', body, signal);
    },

    async verifyPayment(body: { paymentId: string }, signal?: AbortSignal): Promise<{ verified: boolean; error?: string }> {
        return postJson('/google-pay/verify', body, signal);
    },
};

export default GooglePayService;