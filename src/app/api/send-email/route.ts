import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const TARGET_EMAIL = 'arupchaki545@gmail.com';

interface EmailPayload {
  type: 'order' | 'contact';
  name: string;
  contact: string; // Discord / Email / Roblox username
  topic?: string;
  message?: string;
  assetTitle?: string;
  assetPrice?: string;
  paymentMethod?: string;
  robloxUsername?: string;
}

export async function POST(req: Request) {
  try {
    const data: EmailPayload = await req.json();

    if (!data.name || !data.contact) {
      return NextResponse.json(
        { success: false, error: 'Name and contact information are required.' },
        { status: 400 }
      );
    }

    const isOrder = data.type === 'order';
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const subject = isOrder
      ? `🛒 [NEW ORDER] ${data.assetTitle || 'Roblox System'} - from ${data.name}`
      : `💬 [PORTFOLIO MESSAGE] ${data.topic || 'Inquiry'} from ${data.name}`;

    const textContent = isOrder
      ? `NEW ORDER RECEIVED on Portfolio!
===================================
Product: ${data.assetTitle || 'Roblox System'}
Price: ${data.assetPrice || 'N/A'}
Payment Method: ${data.paymentMethod || 'Not specified'}

Buyer Details:
- Name: ${data.name}
- Discord / Contact: ${data.contact}
- Roblox Username: ${data.robloxUsername || 'N/A'}

Additional Notes:
${data.message || 'No additional notes provided.'}

Time (Bangladesh): ${timestamp}
Sent to: ${TARGET_EMAIL}`
      : `NEW CONTACT MESSAGE on Portfolio!
====================================
Sender Name: ${data.name}
Contact Handle / Email: ${data.contact}
Topic: ${data.topic || 'General Inquiry'}

Message:
${data.message || '(Empty message)'}

Time (Bangladesh): ${timestamp}
Sent to: ${TARGET_EMAIL}`;

    const htmlContent = isOrder
      ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b0f17; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0284c7, #38bdf8); padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 24px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 10px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #1f2937; }
    .info-table td.label { width: 38%; color: #94a3b8; font-weight: 500; }
    .info-table td.val { color: #f8fafc; font-weight: 600; font-family: monospace; }
    .highlight-box { background: #1e293b; border-left: 4px solid #38bdf8; padding: 14px; border-radius: 6px; margin: 16px 0; font-size: 13px; line-height: 1.5; color: #cbd5e1; white-space: pre-wrap; }
    .footer { padding: 16px 24px; background: #0f172a; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🛒 New Roblox System Order!</h1>
      <p>A customer has placed an order from your portfolio website</p>
    </div>
    <div class="content">
      <div class="section-title">Item Details</div>
      <table class="info-table">
        <tr>
          <td class="label">Product / System:</td>
          <td class="val" style="color: #38bdf8;">${data.assetTitle || 'Roblox System'}</td>
        </tr>
        <tr>
          <td class="label">Price:</td>
          <td class="val" style="color: #34d399;">${data.assetPrice || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Payment Method:</td>
          <td class="val">${data.paymentMethod || 'Direct Contact'}</td>
        </tr>
      </table>

      <div class="section-title">Buyer Information</div>
      <table class="info-table">
        <tr>
          <td class="label">Buyer Name:</td>
          <td class="val">${data.name}</td>
        </tr>
        <tr>
          <td class="label">Discord / Contact:</td>
          <td class="val" style="color: #a78bfa;">${data.contact}</td>
        </tr>
        <tr>
          <td class="label">Roblox Username:</td>
          <td class="val">${data.robloxUsername || 'Not provided'}</td>
        </tr>
      </table>

      <div class="section-title">Buyer Notes / Message</div>
      <div class="highlight-box">${data.message ? data.message.replace(/</g, '&lt;') : 'No extra notes provided.'}</div>
    </div>
    <div class="footer">
      Delivered automatically to <strong>${TARGET_EMAIL}</strong> · ${timestamp}
    </div>
  </div>
</body>
</html>`
      : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b0f17; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 24px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 10px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #1f2937; }
    .info-table td.label { width: 38%; color: #94a3b8; font-weight: 500; }
    .info-table td.val { color: #f8fafc; font-weight: 600; font-family: monospace; }
    .message-box { background: #1e293b; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap; }
    .footer { padding: 16px 24px; background: #0f172a; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>💬 New Portfolio Contact Message</h1>
      <p>Someone reached out via your website contact terminal</p>
    </div>
    <div class="content">
      <div class="section-title">Sender Details</div>
      <table class="info-table">
        <tr>
          <td class="label">Sender Name:</td>
          <td class="val">${data.name}</td>
        </tr>
        <tr>
          <td class="label">Contact Handle / Email:</td>
          <td class="val" style="color: #38bdf8;">${data.contact}</td>
        </tr>
        <tr>
          <td class="label">Inquiry Topic:</td>
          <td class="val" style="color: #34d399;">${data.topic || 'General Inquiry'}</td>
        </tr>
      </table>

      <div class="section-title">Message Body</div>
      <div class="message-box">${data.message ? data.message.replace(/</g, '&lt;') : '(Empty message)'}</div>
    </div>
    <div class="footer">
      Delivered automatically to <strong>${TARGET_EMAIL}</strong> · ${timestamp}
    </div>
  </div>
</body>
</html>`;

    // 1. Check if user configured Gmail App Password or SMTP in environment
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || TARGET_EMAIL;
    const smtpPass = process.env.SMTP_PASS || gmailAppPassword;

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport(
          smtpHost
            ? {
                host: smtpHost,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: smtpUser, pass: smtpPass },
              }
            : {
                service: 'gmail',
                auth: { user: smtpUser, pass: smtpPass },
              }
        );

        await transporter.sendMail({
          from: `"Arup Portfolio" <${smtpUser}>`,
          to: TARGET_EMAIL,
          replyTo: data.contact.includes('@') ? data.contact : undefined,
          subject,
          text: textContent,
          html: htmlContent,
        });

        return NextResponse.json({
          success: true,
          method: 'smtp',
          message: 'Email delivered successfully to ' + TARGET_EMAIL,
        });
      } catch (smtpErr: any) {
        console.warn('SMTP delivery failed, trying fallback...', smtpErr?.message);
      }
    }

    // 2. High-reliability Serverless Fallback (Works immediately with zero config!)
    // Using FormSubmit.co serverless REST endpoint to guarantee delivery to arupchaki545@gmail.com
    try {
      const fallbackRes = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          _captcha: 'false',
          Type: isOrder ? 'STORE ORDER' : 'CONTACT MESSAGE',
          Customer_Name: data.name,
          Customer_Contact: data.contact,
          Product: data.assetTitle || 'N/A',
          Price: data.assetPrice || 'N/A',
          Payment_Method: data.paymentMethod || 'N/A',
          Roblox_Username: data.robloxUsername || 'N/A',
          Topic: data.topic || 'N/A',
          Message: data.message || '',
          Sent_At: timestamp,
        }),
      });

      if (fallbackRes.ok) {
        return NextResponse.json({
          success: true,
          method: 'fallback_relay',
          message: 'Message delivered to ' + TARGET_EMAIL,
        });
      }
    } catch (relayErr: any) {
      console.error('Relay delivery error:', relayErr?.message);
    }

    // 3. If both failed, return success with client fallback flag
    return NextResponse.json(
      {
        success: false,
        error: 'Could not send email automatically. Please reach out via Discord or email directly.',
        targetEmail: TARGET_EMAIL,
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Send email API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
