
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// Initialize Firebase Admin SDK
// Check if the app is already initialized to avoid errors
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

const db = getFirestore();

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

  // --- 1. Validate Input Data ---
  if (!name || !details) {
    console.error("Validation failed: Name and details are required.");
    return NextResponse.json(
        { success: false, message: 'Name and project details are required.' },
        { status: 400 }
    );
  }

  // --- 2. Save Data to Firestore ---
  let docId: string;
  try {
    const payload = {
      name,
      email: email || "",
      phone: phone || "",
      comment: details, // Using 'comment' field to match the collection
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
      status: "pending",
      timestamp: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("comments").add(payload);
    docId = docRef.id;
    console.log(`Data successfully saved to 'comments' collection with ID: ${docId}`);
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    return NextResponse.json(
        { success: false, message: 'Failed to save your request. Please try again.' },
        { status: 500 }
    );
  }

  // --- 3. Send Email Notification using Resend ---
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not set. Email notifications will be disabled.");
    return NextResponse.json({ success: true, orderId: docId, message: "Order saved, but email notification is disabled." });
  }
  const resend = new Resend(resendApiKey);
  
  if (!process.env.EMAIL_SUBJECT_TEMPLATE || !process.env.EMAIL_BODY_TEMPLATE) {
      console.error("Email template environment variables (EMAIL_SUBJECT_TEMPLATE, EMAIL_BODY_TEMPLATE) are not set.");
      return NextResponse.json({ success: true, orderId: docId, message: "Order saved, but email templates are not configured." });
  }

  try {
    // Build email content from templates
    const subject = process.env.EMAIL_SUBJECT_TEMPLATE.replace('{{name}}', name);
    const emailBody = process.env.EMAIL_BODY_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{email}}', email ? `<li><strong>Email:</strong> ${email}</li>` : "")
        .replace('{{phone}}', phone ? `<li><strong>Phone:</strong> ${phone}</li>` : "")
        .replace('{{details}}', details)
        .replace('{{attachment}}', attachmentUrl ? `<p><strong>Attachment:</strong> <a href="${attachmentUrl}" target="_blank">${attachmentName || "View Attachment"}</a></p>` : "")
        .replace('{{orderId}}', docId);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Project Request <noreply@muzos.dev>", 
      to: ["musondasalim@gmail.com"],
      subject: subject,
      html: emailBody,
    });

    if (emailError) {
       console.error("Resend API error:", emailError);
       return NextResponse.json({ success: true, orderId: docId, message: "Order saved, but failed to send email notification." });
    }

    console.log(`Email notification sent successfully. Email ID: ${emailData?.id}`);
  } catch (error) {
    console.error("Error sending email notification:", error);
    return NextResponse.json({ success: true, orderId: docId, message: "Order saved, but an unexpected error occurred while sending email." });
  }
  
  // --- 4. Return Success Response ---
  return NextResponse.json({ success: true, orderId: docId, message: "Your request has been submitted successfully!" });
}
