
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface OrderRequestData {
    name: string;
    email?: string;
    phone?: string;
    details: string;
    attachmentUrl?: string;
    attachmentName?: string;
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const data: OrderRequestData = await req.json();
  const { name, email, phone, details, attachmentUrl, attachmentName } = data;
  const orderId = `guest-request-${Date.now()}`;

  // --- 1. Validate Input Data ---
  if (!name || !details) {
    console.error("Validation failed: Name and details are required.");
    return NextResponse.json(
        { success: false, message: 'Name and project details are required.' },
        { status: 400 }
    );
  }
  
  if (!email && !phone) {
    console.error("Validation failed: Email or phone is required.");
    return NextResponse.json(
        { success: false, message: 'An email or phone number is required.' },
        { status: 400 }
    );
  }

  // --- 2. Send Email Notification using Resend ---
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not set. Email notifications are disabled.");
    // Even if email fails, we can consider the request 'successful' from user's perspective
    return NextResponse.json({ success: true, orderId: orderId, message: "Request noted, but email notification is disabled on server." });
  }
  
  const resend = new Resend(resendApiKey);
  
  const emailSubjectTemplate = process.env.EMAIL_SUBJECT_TEMPLATE;
  const emailBodyTemplate = process.env.EMAIL_BODY_TEMPLATE;

  if (!emailSubjectTemplate || !emailBodyTemplate) {
      console.error("Email template environment variables (EMAIL_SUBJECT_TEMPLATE, EMAIL_BODY_TEMPLATE) are not set.");
      // Gracefully handle missing templates
      return NextResponse.json({ success: true, orderId: orderId, message: "Request noted, but email templates are not configured on server." });
  }

  try {
    // Build email content from templates
    const subject = emailSubjectTemplate.replace('{{name}}', name);
    const emailBody = emailBodyTemplate
        .replace('{{name}}', name)
        .replace('{{email}}', email ? `<li><strong>Email:</strong> ${email}</li>` : "")
        .replace('{{phone}}', phone ? `<li><strong>Phone:</strong> ${phone}</li>` : "")
        .replace('{{details}}', details)
        .replace('{{attachment}}', attachmentUrl ? `<p><strong>Attachment:</strong> <a href="${attachmentUrl}" target="_blank">${attachmentName || "View Attachment"}</a></p>` : "")
        .replace('{{orderId}}', orderId);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Project Request <noreply@muzos.dev>", 
      to: ["musondasalim@gmail.com"],
      subject: subject,
      html: emailBody,
    });

    if (emailError) {
       console.error("Resend API error:", emailError);
       // The request was submitted, but email failed. Inform client but still count as success.
       return NextResponse.json({ success: true, orderId: orderId, message: "Request received, but failed to send email notification." });
    }

    console.log(`Email notification sent successfully. Email ID: ${emailData?.id}`);
  } catch (error) {
    console.error("Error sending email notification:", error);
    // Again, user's request is "in", but there was a server issue.
    return NextResponse.json({ success: true, orderId: orderId, message: "Request received, but an unexpected error occurred while sending email." });
  }
  
  // --- 3. Return Success Response ---
  return NextResponse.json({ success: true, orderId: orderId, message: "Your request has been submitted successfully!" });
}
