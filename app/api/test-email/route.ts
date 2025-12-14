import { NextResponse } from 'next/server';
import { sendNoteEmail } from '@/lib/email/send-note';

export const runtime = 'nodejs';

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
    console.log('[test-email] API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 6));

    // Try direct fetch to Resend API
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [to],
          subject: title || 'Test Email',
          html: `<p>${body || 'Test email'}</p>`
        })
      });

      const data = await response.json();
      console.log('[test-email] Direct API response status:', response.status);
      console.log('[test-email] Direct API response:', data);

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Email sent via direct API!',
          data
        });
      } else {
        return NextResponse.json({
          success: false,
          error: data.message || 'API returned error',
          details: data
        }, { status: response.status });
      }
    } catch (fetchError) {
      console.error('[test-email] Fetch error:', fetchError);
      return NextResponse.json({
        error: 'Network error',
        details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
      }, { status: 500 });
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
