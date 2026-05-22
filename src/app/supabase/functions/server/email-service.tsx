// Email service for sending order confirmation emails via Resend

interface OrderItem {
  name: string;
  color?: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingCountry: string;
  deliveryEstimate: string;
  locale: string;
}

// Generate HTML email template
function generateOrderEmailHTML(data: OrderEmailData): string {
  const isGreek = data.locale === 'el';
  
  const translations = {
    subject: isGreek ? 'Επιβεβαίωση Παραγγελίας' : 'Order Confirmation',
    title: isGreek ? 'Ευχαριστούμε για την παραγγελία σας!' : 'Thank you for your order!',
    orderNumber: isGreek ? 'Αριθμός Παραγγελίας' : 'Order Number',
    orderDetails: isGreek ? 'Λεπτομέρειες Παραγγελίας' : 'Order Details',
    product: isGreek ? 'Προϊόν' : 'Product',
    quantity: isGreek ? 'Ποσότητα' : 'Quantity',
    price: isGreek ? 'Τιμή' : 'Price',
    subtotal: isGreek ? 'Υποσύνολο' : 'Subtotal',
    shipping: isGreek ? 'Μεταφορικά' : 'Shipping',
    total: isGreek ? 'Σύνολο' : 'Total',
    delivery: isGreek ? 'Εκτιμώμενη Παράδοση' : 'Estimated Delivery',
    contact: isGreek ? 'Επικοινωνία' : 'Contact',
    contactText: isGreek 
      ? 'Για οποιαδήποτε απορία, επικοινωνήστε μαζί μας:' 
      : 'For any questions, contact us:',
    footer: isGreek
      ? 'Αυτό είναι ένα αυτόματο email. Παρακαλούμε μην απαντήσετε απευθείας.'
      : 'This is an automated email. Please do not reply directly.',
  };

  // Generate product rows
  const productRows = data.items.map(item => {
    let productName = item.name;
    if (item.color) {
      productName += ` - ${item.color}`;
    }
    productName += ` (${isGreek ? 'Μέγεθος' : 'Size'}: ${item.size})`;

    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 12px; vertical-align: middle;">` : ''}
          <span style="vertical-align: middle; font-size: 14px;">${productName}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">€${item.price.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="${isGreek ? 'el' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${translations.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 2px;">GORGONSTONE</h1>
                  <p style="margin: 8px 0 0; color: #d1d5db; font-size: 14px;">${translations.title}</p>
                </td>
              </tr>

              <!-- Order Number -->
              <tr>
                <td style="padding: 30px 40px 20px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">${translations.orderNumber}</p>
                  <p style="margin: 4px 0 0; color: #111827; font-size: 20px; font-weight: bold;">#${data.orderId}</p>
                </td>
              </tr>

              <!-- Order Details -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: bold;">${translations.orderDetails}</h2>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 4px;">
                    <thead>
                      <tr style="background-color: #f9fafb;">
                        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; border-bottom: 1px solid #e5e7eb;">${translations.product}</th>
                        <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; border-bottom: 1px solid #e5e7eb;">${translations.quantity}</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; border-bottom: 1px solid #e5e7eb;">${translations.price}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productRows}
                    </tbody>
                  </table>

                  <!-- Totals -->
                  <table role="presentation" style="width: 100%; margin-top: 20px;">
                    <tr>
                      <td style="padding: 8px 0; text-align: right; color: #6b7280; font-size: 14px;">${translations.subtotal}:</td>
                      <td style="padding: 8px 0 8px 20px; text-align: right; color: #111827; font-size: 14px; font-weight: 600;">€${data.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; text-align: right; color: #6b7280; font-size: 14px;">${translations.shipping} (${data.shippingCountry}):</td>
                      <td style="padding: 8px 0 8px 20px; text-align: right; color: #111827; font-size: 14px; font-weight: 600;">€${data.shippingCost.toFixed(2)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #111827;">
                      <td style="padding: 12px 0 0; text-align: right; color: #111827; font-size: 16px; font-weight: bold;">${translations.total}:</td>
                      <td style="padding: 12px 0 0 20px; text-align: right; color: #111827; font-size: 18px; font-weight: bold;">€${data.total.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Delivery Estimate -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px;">
                    <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">📦 ${translations.delivery}</p>
                    <p style="margin: 4px 0 0; color: #047857; font-size: 14px;">${data.deliveryEstimate}</p>
                  </div>
                </td>
              </tr>

              <!-- Contact Info -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">${translations.contactText}</p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600;">
                      <a href="mailto:infogorgonstone@gmail.com" style="color: #111827; text-decoration: none;">infogorgonstone@gmail.com</a>
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">${translations.footer}</p>
                  <p style="margin: 12px 0 0; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Gorgonstone. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    return false;
  }

  const isGreek = data.locale === 'el';
  const subject = isGreek 
    ? `✅ Επιβεβαίωση Παραγγελίας #${data.orderId}`
    : `✅ Order Confirmation #${data.orderId}`;

  const htmlContent = generateOrderEmailHTML(data);

  try {
    console.log(`📧 Sending order confirmation email to ${data.customerEmail}...`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Gorgonstone <onboarding@resend.dev>',
        to: [data.customerEmail],
        subject: subject,
        html: htmlContent,
        reply_to: 'infogorgonstone@gmail.com',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to send email via Resend:', result);
      return false;
    }

    console.log('✅ Order confirmation email sent successfully:', result.id);
    return true;
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
    return false;
  }
}
