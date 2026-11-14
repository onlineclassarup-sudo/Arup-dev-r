import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { escapeHtml, sanitizeText } from '@/lib/security';

export const dynamic = 'force-dynamic';

interface EmailPayload {
  type: 'order' | 'contact';
  name: string;
  contact: string;
  topic?: string;
  message?: string;
  assetTitle?: string;
  assetPrice?: string;
  paymentMethod?: string;
  robloxUsername?: string;
  honeypot?: string;
}

export async function POST(request: Request) {
  try {
    const body: EmailPayload = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }

    // Bot trap
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    }

    const { type, name, contact, topic, message, assetTitle, assetPrice, paymentMethod, robloxUsername } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!contact || typeof contact !== 'string' || !contact.trim()) {
      return NextResponse.json({ error: 'Contact handle (Discord or Email) is required.' }, { status: 400 });
    }

    const isOrder = type === 'order';

    // Sanitize inputs
    const safeName = sanitizeText(name, 80);
    const safeContact = sanitizeText(contact, 120);
    const safeTopic = sanitizeText(topic || 'General Inquiry', 80);
    const safeMessage = sanitizeText(message || '', 3000);
    const safeAssetTitle = sanitizeText(assetTitle || 'Roblox System', 100);
    const safeAssetPrice = sanitizeText(assetPrice || 'N/A', 50);
    const safePaymentMethod = sanitizeText(paymentMethod || 'Direct Inquiry', 50);
    const safeRobloxUsername = sanitizeText(robloxUsername || '', 60);

    const htmlName = escapeHtml(safeName);
    const htmlContact = escapeHtml(safeContact);
    const htmlTopic = escapeHtml(safeTopic);
    const htmlMessage = escapeHtml(safeMessage);
    const htmlAssetTitle = escapeHtml(safeAssetTitle);
    const htmlAssetPrice = escapeHtml(safeAssetPrice);
    const htmlPaymentMethod = escapeHtml(safePaymentMethod);
    const htmlRobloxUsername = escapeHtml(safeRobloxUsername);

    // Vercel / Environment Credentials (exact proven setup from mominul protfolio)
    const recipientEmail = process.env.NOTIFICATION_EMAIL || 'arupchaki545@gmail.com';
    const gmailUser = process.env.GMAIL_USER || 'mominulwebwork@gmail.com';
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'jqopjchfoyoqmror').replace(/\s+/g, '');
    const resendApiKey = process.env.RESEND_API_KEY;

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailSubject = isOrder
      ? `🛒 [New Order] ${safeAssetTitle} - ${safeName} (${safePaymentMethod})`
      : `💬 [Portfolio Contact] ${safeTopic} from ${safeName}`;

    const plainText = isOrder
      ? `NEW ORDER RECEIVED on Arup's Roblox Portfolio!
==================================================
Item: ${safeAssetTitle}
Price: ${safeAssetPrice}
Payment Method: ${safePaymentMethod}

Customer Information:
- Name: ${safeName}
- Discord / Contact: ${safeContact}
- Roblox Username: ${safeRobloxUsername || 'Not provided'}

Customer Message / Notes:
${safeMessage || 'No extra notes provided.'}

Time (Bangladesh Time): ${timestamp}
Sent to: ${recipientEmail}`
      : `NEW MESSAGE on Arup's Portfolio!
===================================
Sender Name: ${safeName}
Contact (Discord / Email): ${safeContact}
Inquiry Topic: ${safeTopic}

Message Details:
${safeMessage || '(No message content)'}

Time (Bangladesh Time): ${timestamp}
Sent to: ${recipientEmail}`;

    const htmlBody = isOrder
      ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f8fafc; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); padding: 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold;">🛒 New System Order Received!</h1>
      <p style="margin: 6px 0 0; color: #f0f9ff; font-size: 13px;">A customer placed an order on your Roblox Portfolio</p>
    </div>
    <div style="padding: 24px;">
      <div style="background: #1e293b; padding: 18px; border-radius: 12px; border: 1px solid #334155; text-align: center; margin-bottom: 20px;">
        <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">System Ordered</span>
        <div style="font-size: 20px; font-weight: bold; color: #38bdf8; margin: 6px 0;">${htmlAssetTitle}</div>
        <div style="font-size: 16px; font-weight: bold; color: #10b981; font-family: monospace;">Price: ${htmlAssetPrice}</div>
        <span style="display: inline-block; background: #0369a1; color: #e0f2fe; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; margin-top: 6px;">Payment: ${htmlPaymentMethod}</span>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; width: 140px;">Buyer Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #ffffff; font-weight: bold;">${htmlName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8;">Discord / Contact:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #38bdf8; font-weight: bold; font-family: monospace;">${htmlContact}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8;">Roblox Username:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #a78bfa; font-weight: bold; font-family: monospace;">${htmlRobloxUsername || 'Not provided'}</td>
        </tr>
      </table>

      <div style="background: #1e293b; padding: 16px; border-radius: 12px; border: 1px solid #334155;">
        <h3 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Customer Notes:</h3>
        <p style="margin: 0; color: #cbd5e1; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${htmlMessage || 'No extra notes provided.'}</p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${encodeURI(safeContact)}?subject=Re:%20Order%20for%20${encodeURIComponent(safeAssetTitle)}" style="display: inline-block; background: #38bdf8; color: #082f49; font-weight: bold; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-size: 13px;">Reply to Customer</a>
      </div>
    </div>
    <div style="background: #090d16; padding: 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
      Delivered directly to <strong>${recipientEmail}</strong> · ${timestamp}
    </div>
  </div>
</body>
</html>`
      : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f8fafc; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold;">💬 New Portfolio Message</h1>
      <p style="margin: 6px 0 0; color: #e2e8f0; font-size: 13px;">Someone reached out from your portfolio contact form</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; width: 140px;">Sender Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #ffffff; font-weight: bold;">${htmlName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8;">Contact Handle:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #38bdf8; font-weight: bold; font-family: monospace;">${htmlContact}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8;">Topic:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #10b981; font-weight: bold;">${htmlTopic}</td>
        </tr>
      </table>

      <div style="background: #1e293b; padding: 18px; border-radius: 12px; border: 1px solid #334155;">
        <h3 style="margin: 0 0 10px 0; color: #10b981; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message Content:</h3>
        <p style="margin: 0; color: #f1f5f9; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${htmlMessage || '(No message)'}</p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${encodeURI(safeContact)}?subject=Re:%20${encodeURIComponent(safeTopic)}" style="display: inline-block; background: #10b981; color: #022c22; font-weight: bold; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-size: 13px;">Reply to Sender</a>
      </div>
    </div>
    <div style="background: #090d16; padding: 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
      Delivered directly to <strong>${recipientEmail}</strong> · ${timestamp}
    </div>
  </div>
</body>
</html>`;

    let emailDelivered = false;
    let deliveryMethod = 'none';

    // 1. Primary: Direct Secure Gmail SMTP via SSL Port 465 (Tested and proven in mominul protfolio)
    if (gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"Arup Portfolio" <${gmailUser}>`,
          to: recipientEmail,
          replyTo: safeContact.includes('@') ? safeContact : undefined,
          subject: emailSubject,
          text: plainText,
          html: htmlBody,
        });

        emailDelivered = true;
        deliveryMethod = 'gmail_smtp';
      } catch (smtpErr: any) {
        console.error('Gmail SMTP dispatch error:', smtpErr);
      }
    }

    // 2. Secondary: Resend API (if configured)
    if (!emailDelivered && resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Arup Portfolio <onboarding@resend.dev>',
            to: [recipientEmail],
            reply_to: safeContact.includes('@') ? safeContact : undefined,
            subject: emailSubject,
            text: plainText,
            html: htmlBody,
          }),
        });

        if (resendRes.ok) {
          emailDelivered = true;
          deliveryMethod = 'resend_api';
        }
      } catch (resendErr: any) {
        console.error('Resend dispatch error:', resendErr);
      }
    }

    return NextResponse.json({
      success: true,
      delivered: emailDelivered,
      method: deliveryMethod,
      message: 'Inquiry received securely.',
    });
  } catch (error: any) {
    console.error('Send email API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
