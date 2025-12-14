import { NextResponse } from 'next/server';
import { sendNoteEmail } from '@/lib/email/send-note';

export async function POST(request: Request) {
  try {
    const { to, title, body } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: 'Missing "to" email address' },
        { status: 400 }
      );
    }

    console.log('[test-email] Attempting to send test email to:', to);
    console.log('[test-email] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

    const result = await sendNoteEmail({
      recipients: [{ email: to, role: 'to' }],
      title: title || 'Test Email',
      body: body || 'This is a test email from your Vibe App!',
    });

    console.log('[test-email] Result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully!',
        emailId: result.emailId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Failed to send email'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[test-email] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
