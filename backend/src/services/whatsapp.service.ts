export class WhatsAppService {
  public static async sendOrderConfirmation(data: {
    toPhone: string;
    customerName: string;
    orderNumber: string;
    totalAmount: number;
    shippingAddress: string;
  }) {
    const { toPhone, customerName, orderNumber, totalAmount, shippingAddress } = data;

    const token = process.env.META_ACCESS_TOKEN;
    const phoneId = process.env.META_PHONE_NUMBER_ID;

    // Use sandbox dry-run mode if token/phoneId is missing or default
    if (!token || !phoneId || token === 'your_meta_access_token' || phoneId === 'your_whatsapp_phone_number_id') {
      console.log(`
📱 [WhatsApp Sandbox Dry-Run Mode]
--------------------------------------------------
To: ${toPhone}
Body Template: order_confirmation
Variables:
  1. Name: ${customerName}
  2. Order Number: ${orderNumber}
  3. Total Amount: ₹${totalAmount.toLocaleString('en-IN')}
  4. Address: ${shippingAddress}
--------------------------------------------------
`);
      return;
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: toPhone,
        type: 'template',
        template: {
          name: 'order_confirmation', // Must match your Meta Developer console approved template name
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: customerName },
                { type: 'text', text: orderNumber },
                { type: 'text', text: `₹${totalAmount.toLocaleString('en-IN')}` },
                { type: 'text', text: shippingAddress },
              ],
            },
          ],
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();

      if (!response.ok) {
        console.error('[WhatsApp Service Error] Meta Graph API responded with error:', resJson);
      } else {
        console.log('[WhatsApp Service Success] Order notification sent successfully:', resJson);
      }
    } catch (error) {
      console.error('[WhatsApp Service Error] Network request failed:', error);
    }
  }
}
