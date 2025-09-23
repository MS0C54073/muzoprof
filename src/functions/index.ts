
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Initialize Resend with API key from environment variables
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  logger.warn("RESEND_API_KEY not set. Email notifications will be disabled.");
}

interface OrderRequestData {
    name: string;
    email?: string;
    phone?: string;
    details: string;
    attachmentUrl?: string;
    attachmentName?: string;
}

// Define the callable function
export const processOrder = onCall(async (request) => {
  logger.info("processOrder function triggered", { structuredData: true });

  const data: OrderRequestData = request.data;
  const { name, email, phone, details, attachmentUrl, attachmentName } = data;

  // --- 1. Validate Input Data ---
  if (!name || !details) {
    logger.error("Validation failed: Name and details are required.");
    throw new HttpsError(
      "invalid-argument",
      "Name and project details are required."
    );
  }

  // --- 2. Save Data to Firestore ---
  let orderId: string;
  try {
    const orderPayload = {
      name,
      email: email || "",
      phone: phone || "",
      details,
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
      status: "pending",
      timestamp: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("orders").add(orderPayload);
    orderId = docRef.id;
    logger.info(`Order successfully saved to Firestore with ID: ${orderId}`);
  } catch (error) {
    logger.error("Error saving order to Firestore:", error);
    throw new HttpsError(
      "internal",
      "Failed to save your request. Please try again."
    );
  }

  // --- 3. Send Email Notification using Resend ---
  if (!resend) {
    logger.warn("Resend not initialized. Skipping email notification.");
    // Even if email fails, we return success because the order was saved.
    return { success: true, orderId, message: "Order saved, but email notification is disabled." };
  }

  try {
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Project Request <onboarding@resend.dev>", // Must be a verified domain in Resend
      to: ["musondasalim@gmail.com"],
      subject: `New Project Request from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Project Request Received</h2>
          <p>You have a new project request submitted through your portfolio website.</p>
          <hr>
          <h3>Requester Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            ${email ? `<li><strong>Email:</strong> ${email}</li>` : ""}
            ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ""}
          </ul>
          <h3>Project Details:</h3>
          <p style="white-space: pre-wrap; background-color: #f4f4f5; padding: 10px; border-radius: 5px;">${details}</p>
          ${attachmentUrl ? `<p><strong>Attachment:</strong> <a href="${attachmentUrl}" target="_blank">${attachmentName || "View Attachment"}</a></p>` : ""}
          <hr>
          <p><em>This email was sent automatically from your portfolio contact form. Order ID: ${orderId}</em></p>
        </div>
      `,
    });

    if (emailError) {
       logger.error("Resend API error:", emailError);
       // Don't throw an error to the client, just log it.
       // The primary action (saving to DB) was successful.
       return { success: true, orderId, message: "Order saved, but failed to send email notification." };
    }

    logger.info(`Email notification sent successfully. Email ID: ${emailData?.id}`);
  } catch (error) {
    logger.error("Error sending email notification:", error);
    // Again, don't throw to client.
    return { success: true, orderId, message: "Order saved, but an unexpected error occurred while sending email." };
  }
  
  // --- 4. Return Success Response ---
  return { success: true, orderId, message: "Your request has been submitted successfully!" };
});
