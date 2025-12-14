import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailRecipient = {
  email: string;
  role: 'to' | 'cc';
};

export type SendNoteEmailParams = {
  recipients: EmailRecipient[];
  title: string;
  body: string;
  senderEmail?: string;
  senderName?: string;
};

export async function sendNoteEmail({
  recipients,
  title,
  body,
  senderEmail = 'onboarding@resend.dev',
  senderName = 'Vibe App Notes'
}: SendNoteEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error('[sendNoteEmail] RESEND_API_KEY is not configured');
    throw new Error('Email service is not configured. Please set RESEND_API_KEY environment variable.');
  }

  if (recipients.length === 0) {
    console.log('[sendNoteEmail] No recipients provided, skipping email send');
    return { success: true, message: 'No recipients to send to' };
  }

  const toRecipients = recipients
    .filter(r => r.role === 'to')
    .map(r => r.email);

  const ccRecipients = recipients
    .filter(r => r.role === 'cc')
    .map(r => r.email);

  if (toRecipients.length === 0) {
    console.warn('[sendNoteEmail] No "to" recipients found, email not sent');
    return { success: false, message: 'At least one "to" recipient is required' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: toRecipients,
      cc: ccRecipients.length > 0 ? ccRecipients : undefined,
      subject: title || 'New Note',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${title || 'New Note'}</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="white-space: pre-wrap; color: #555;">${body || ''}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            This note was sent from Vibe App
          </p>
        </div>
      `,
      text: `${title || 'New Note'}\n\n${body || ''}`,
    });

    if (error) {
      console.error('[sendNoteEmail] Resend API error:', error);
      return { success: false, message: error.message };
    }

    console.log('[sendNoteEmail] Email sent successfully:', data?.id);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('[sendNoteEmail] Unexpected error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
