import { verifyPayment } from './api';

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    if ((window as any).Razorpay) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface OpenRazorpayOptions {
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export const openRazorpayCheckout = async (options: OpenRazorpayOptions) => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load. Please check your network connection.');
  }

  const razorpayOptions = {
    key: options.keyId,
    amount: options.amount,
    currency: options.currency,
    name: 'NexusStore Checkout',
    description: `Payment for Order #${options.orderId}`,
    order_id: options.orderId,
    prefill: {
      name: options.customerName || '',
      email: options.customerEmail || '',
      contact: options.customerPhone || '',
    },
    theme: {
      color: '#6366f1',
    },
    handler: async function (response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) {
      try {
        const verifyRes = await verifyPayment(response);
        options.onSuccess(verifyRes);
      } catch (err) {
        options.onFailure(err);
      }
    },
    modal: {
      ondismiss: function () {
        options.onFailure(new Error('Payment window closed by user'));
      },
    },
  };

  const paymentObject = new (window as any).Razorpay(razorpayOptions);
  paymentObject.open();
};
