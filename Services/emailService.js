// // // services/emailService.js

// // import nodemailer from 'nodemailer';
// // import Subscriber from '../models/Subscriber.js';

// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // const createEmailHtml = (poem) => {
// //   const poemPreview = poem.preview || poem.content.substring(0, 150) + '...';
// //   const poemUrl = `${process.env.FRONTEND_URL}/poems`;

// //   return `
// //     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
// //       <div style="background-color: #6D28D9; color: white; padding: 20px; text-align: center;">
// //         <h1 style="margin: 0;">OreoVerse</h1>
// //       </div>
// //       <div style="padding: 20px;">
// //         <h2 style="color: #4B0082;">A New Verse Has Dropped ✨</h2>
// //         <p>Hey Poetry Lover,</p>
// //         <p>A brand new poem has just been published in the OreoVerse, and we wanted you to be the first to know!</p>
// //         <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #6D28D9;">
// //           <h3 style="margin-top: 0;">${poem.title}</h3>
// //           <p style="font-style: italic;">${poemPreview}</p>
// //         </div>
// //         <div style="text-align: center; margin: 20px 0;">
// //           <a href="${poemUrl}" style="background-color: #8B5CF6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Now</a>
// //         </div>
// //         <p>We hope it brings a little magic to your day.</p>
// //         <p>With love,<br/>Oreo 🍪</p>
// //       </div>
// //       <div style="background-color: #f1f1f1; color: #777; padding: 10px; text-align: center; font-size: 12px;">
// //         <p>You received this because you subscribed to Oreo's Poetry Corner.</p>
// //       </div>
// //     </div>
// //   `;
// // };

// // const sendNewPoemNotification = async (poem) => {
// //   console.log('--- ENTERED EMAIL SERVICE ---');
// //   console.log(`Poem to notify for: "${poem.title}"`);

// //   try {
// //     const subscribers = await Subscriber.find({});

// //     console.log(`Number of subscribers found: ${subscribers.length}`);

// //     if (subscribers.length === 0) {
// //       console.log('No subscribers to notify. Exiting email service.');
// //       return;
// //     }

// //     const recipientEmails = subscribers.map(sub => sub.email);

// //     const mailOptions = {
// //       from: `"Oreo's Poetry Corner" <${process.env.EMAIL_USER}>`,
// //       to: process.env.EMAIL_USER,
// //       bcc: recipientEmails,
// //       subject: `A New Verse from the OreoVerse ✨ | "${poem.title}"`,
// //       html: createEmailHtml(poem),
// //     };

// //     console.log('Attempting to send email with Nodemailer...');
// //     await transporter.sendMail(mailOptions);
// //     console.log(`SUCCESS: New poem notification sent to ${recipientEmails.length} subscribers.`);

// //   } catch (error) {
// //     console.error('--- NODEMAILER ERROR ---');
// //     console.error('Error sending new poem notification:', error);
// //     console.error('--- END NODEMAILER ERROR ---');
// //   }
// // };

// // export { sendNewPoemNotification };

// import nodemailer from 'nodemailer';
// import Subscriber from '../models/Subscriber.js';

// // --- START DIAGNOSTIC LOGS ---
// console.log('--- LOADING services/emailService.js ---');
// console.log('Verifying Environment Variables...');
// console.log(`EMAIL_USER found: ${process.env.EMAIL_USER}`);
// console.log(`EMAIL_PASS found: ${process.env.EMAIL_PASS ? 'Yes (Loaded)' : 'No (UNDEFINED)'}`);
// // --- END DIAGNOSTIC LOGS ---

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const createEmailHtml = (poem) => {
//   const poemPreview = poem.preview || poem.content.substring(0, 150) + '...';
//   const poemUrl = `${process.env.FRONTEND_URL}/poems`;
//   return `... HTML content here ...`; // Your HTML is fine
// };

// const sendNewPoemNotification = async (poem) => {
//   console.log('--- ENTERED EMAIL SERVICE FUNCTION ---');
//   try {
//     const subscribers = await Subscriber.find({});
//     console.log(`Found ${subscribers.length} subscribers.`);
//     if (subscribers.length === 0) {
//       return;
//     }
//     const recipientEmails = subscribers.map(sub => sub.email);
//     const mailOptions = {
//       from: `"Oreo's Poetry Corner" <${process.env.EMAIL_USER}>`,
//       to: process.env.EMAIL_USER,
//       bcc: recipientEmails,
//       subject: `A New Verse from the OreoVerse ✨ | "${poem.title}"`,
//       html: createEmailHtml(poem),
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`SUCCESS: Notification sent to ${recipientEmails.length} subscribers.`);
//   } catch (error) {
//     console.error('--- NODEMAILER ERROR ---:', error);
//   }
// };

// export { sendNewPoemNotification };

// newly upadted code from - claude




// import nodemailer from "nodemailer";
// import Subscriber from "../models/Subscriber.js";

// // Verify environment variables on load
// console.log("--- Loading emailService.js ---");
// console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? "Loaded ✓" : "MISSING ✗"}`);
// console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? "Loaded ✓" : "MISSING ✗"}`);
// console.log(
//   `FRONTEND_URL: ${process.env.FRONTEND_URL ? "Loaded ✓" : "MISSING ✗"}`
// );

// // Create transporter with better error handling
// let transporter;
// try {
//   transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//   console.log("Nodemailer transporter created successfully");
// } catch (error) {
//   console.error("Failed to create Nodemailer transporter:", error);
// }

// // Create beautiful email HTML
// const createEmailHtml = (poem) => {
//   const poemPreview = poem.preview || poem.content.substring(0, 150) + "...";
//   const poemUrl = `${process.env.FRONTEND_URL}/poems`;

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     </head>
//     <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background-color: white;">
//         <div style="background-color: #6D28D9; color: white; padding: 20px; text-align: center;">
//           <h1 style="margin: 0; font-size: 28px;">OreoVerse</h1>
//         </div>
//         <div style="padding: 20px;">
//           <h2 style="color: #4B0082; margin-top: 0;">A New Verse Has Dropped ✨</h2>
//           <p>Hey Poetry Lover,</p>
//           <p>A brand new poem has just been published in the OreoVerse, and we wanted you to be the first to know!</p>
//           <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #6D28D9; margin: 20px 0;">
//             <h3 style="margin-top: 0; color: #6D28D9;">${poem.title}</h3>
//             <p style="font-style: italic; color: #555;">${poemPreview}</p>
//           </div>
//           <div style="text-align: center; margin: 30px 0;">
//             <a href="${poemUrl}" style="background-color: #8B5CF6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Read Full Poem</a>
//           </div>
//           <p>We hope it brings a little magic to your day.</p>
//           <p>With love,<br/>Oreo 🍪</p>
//         </div>
//         <div style="background-color: #f1f1f1; color: #777; padding: 15px; text-align: center; font-size: 12px;">
//           <p style="margin: 0;">You received this because you subscribed to Oreo's Poetry Corner.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// // Main function to send new poem notifications
// const sendNewPoemNotification = async (poem) => {
//   console.log("\n--- EMAIL SERVICE TRIGGERED ---");
//   console.log(`Poem Title: "${poem.title}"`);
//   console.log(`Time: ${new Date().toISOString()}`);

//   try {
//     // Check if transporter exists
//     if (!transporter) {
//       throw new Error(
//         "Email transporter not configured. Check EMAIL_USER and EMAIL_PASS environment variables."
//       );
//     }

//     // Fetch all subscribers
//     const subscribers = await Subscriber.find({});
//     console.log(`📧 Found ${subscribers.length} subscriber(s)`);

//     if (subscribers.length === 0) {
//       console.log("⚠️  No subscribers to notify. Skipping email send.");
//       return { success: true, message: "No subscribers", count: 0 };
//     }

//     // Extract emails
//     const recipientEmails = subscribers.map((sub) => sub.email);
//     console.log(`Recipients: ${recipientEmails.join(", ")}`);

//     // Prepare mail options
//     const mailOptions = {
//       from: `"Oreo's Poetry Corner" <${process.env.EMAIL_USER}>`,
//       to: process.env.EMAIL_USER, // Send to yourself
//       bcc: recipientEmails, // BCC all subscribers
//       subject: `A New Verse from the OreoVerse ✨ | "${poem.title}"`,
//       html: createEmailHtml(poem),
//     };

//     // Send email
//     console.log("📤 Sending email...");
//     const info = await transporter.sendMail(mailOptions);

//     console.log("✅ SUCCESS: Email sent!");
//     console.log(`Message ID: ${info.messageId}`);
//     console.log(`Notified ${recipientEmails.length} subscriber(s)`);
//     console.log("--- EMAIL SERVICE COMPLETE ---\n");

//     return {
//       success: true,
//       message: "Notifications sent successfully",
//       count: recipientEmails.length,
//       messageId: info.messageId,
//     };
//   } catch (error) {
//     console.error("\n❌ EMAIL SERVICEs ERROR:");
//     console.error("Error Type:", error.name);
//     console.error("Error Message:", error.message);

//     if (error.code === "EAUTH") {
//       console.error(
//         "⚠️  Authentication failed. Check your EMAIL_USER and EMAIL_PASS."
//       );
//       console.error(
//         '💡 For Gmail, you need an "App Password", not your regular password.'
//       );
//       console.error(
//         "   Generate one at: https://myaccount.google.com/apppasswords"
//       );
//     }

//     console.error("Full Error:", error);
//     console.error("--- EMAIL SERVICE ERROR END ---\n");

//     return {
//       success: false,
//       error: error.message,
//       errorType: error.code || error.name,
//     };
//   }
// };

// // Test function to verify email service
// const testEmailService = async () => {
//   console.log("\n🧪 Testing Email Service...");

//   try {
//     if (!transporter) {
//       throw new Error("Transporter not initialized");
//     }

//     await transporter.verify();
//     console.log("✅ Email service is ready!");
//     return true;
//   } catch (error) {
//     console.error("❌ Email service test failed:", error.message);
//     return false;
//   }
// };

// export { sendNewPoemNotification, testEmailService };

















import nodemailer from "nodemailer";
import Subscriber from "../models/Subscriber.js";

// Verify environment variables on load
console.log("--- Loading emailService.js ---");
console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? "Loaded ✓" : "MISSING ✗"}`);
console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? "Loaded ✓" : "MISSING ✗"}`);
console.log(
  `FRONTEND_URL: ${process.env.FRONTEND_URL ? "Loaded ✓" : "MISSING ✗"}`
);

// Create transporter with better error handling and timeout settings
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add timeout and connection settings
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 20000, // 20 seconds
    pool: true, // Use pooled connections
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
  });
  console.log("Nodemailer transporter created successfully");

  // Verify transporter on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter verification failed:", error.message);
      console.error("⚠️  Please check your EMAIL_USER and EMAIL_PASS");
      console.error("💡 For Gmail, use an App Password: https://myaccount.google.com/apppasswords");
    } else {
      console.log("✅ Email transporter is ready to send emails");
    }
  });
} catch (error) {
  console.error("Failed to create Nodemailer transporter:", error);
}

// Create beautiful email HTML
const createEmailHtml = (poem) => {
  const poemPreview = poem.preview || poem.content.substring(0, 150) + "...";
  const poemUrl = `${process.env.FRONTEND_URL}/poems`;
  const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background-color: white;">
        <div style="background-color: #6D28D9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">OreoVerse</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #4B0082; margin-top: 0;">A New Verse Has Dropped ✨</h2>
          <p>Hey Poetry Lover,</p>
          <p>A brand new poem has just been published in the OreoVerse, and we wanted you to be the first to know!</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #6D28D9; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6D28D9;">${poem.title}</h3>
            <p style="font-style: italic; color: #555;">${poemPreview}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${poemUrl}" style="background-color: #8B5CF6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Read Full Poem</a>
          </div>
          <p>We hope it brings a little magic to your day.</p>
          <p>With love,<br/>Oreo 🍪</p>
        </div>
        <div style="background-color: #f1f1f1; color: #777; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 5px 0;">You received this because you subscribed to Oreo's Poetry Corner.</p>
          <p style="margin: 5px 0;"><a href="${unsubscribeUrl}" style="color: #8B5CF6; text-decoration: none;">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Main function to send new poem notifications with retry logic
const sendNewPoemNotification = async (poem) => {
  console.log("\n--- EMAIL SERVICE TRIGGERED ---");
  console.log(`Poem Title: "${poem.title}"`);
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    // Check if transporter exists
    if (!transporter) {
      throw new Error(
        "Email transporter not configured. Check EMAIL_USER and EMAIL_PASS environment variables."
      );
    }

    // Fetch all subscribers
    const subscribers = await Subscriber.find({});
    console.log(`📧 Found ${subscribers.length} subscriber(s)`);

    if (subscribers.length === 0) {
      console.log("⚠️  No subscribers to notify. Skipping email send.");
      return { success: true, message: "No subscribers", count: 0 };
    }

    // Extract emails
    const recipientEmails = subscribers.map((sub) => sub.email);
    console.log(`Recipients: ${recipientEmails.join(", ")}`);

    // Prepare mail options
    const mailOptions = {
      from: `"Oreo's Poetry Corner" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      bcc: recipientEmails, // BCC all subscribers
      subject: `A New Verse from the OreoVerse ✨ | "${poem.title}"`,
      html: createEmailHtml(poem),
      text: `A new poem "${poem.title}" has been published on OreoVerse!\n\nRead it here: ${process.env.FRONTEND_URL}/poems\n\nUnsubscribe: ${process.env.FRONTEND_URL}/unsubscribe`,
    };

    // Retry logic
    console.log("📤 Sending email...");
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        const info = await transporter.sendMail(mailOptions);

        console.log("✅ SUCCESS: Email sent!");
        console.log(`Message ID: ${info.messageId}`);
        console.log(`Notified ${recipientEmails.length} subscriber(s)`);
        console.log("--- EMAIL SERVICE COMPLETE ---\n");

        return {
          success: true,
          message: "Notifications sent successfully",
          count: recipientEmails.length,
          messageId: info.messageId,
        };
      } catch (error) {
        attempts++;
        lastError = error;
        console.log(`⚠️  Attempt ${attempts}/${maxAttempts} failed:`, error.message);

        if (attempts < maxAttempts) {
          const waitTime = attempts * 2; // 2s, 4s, 6s
          console.log(`Retrying in ${waitTime} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
        }
      }
    }

    // All attempts failed
    throw lastError;
  } catch (error) {
    console.error("\n❌ EMAIL SERVICE ERROR:");
    console.error("Error Type:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);

    if (error.code === "EAUTH") {
      console.error(
        "⚠️  Authentication failed. Check your EMAIL_USER and EMAIL_PASS."
      );
      console.error(
        '💡 For Gmail, you need an "App Password", not your regular password.'
      );
      console.error(
        "   Generate one at: https://myaccount.google.com/apppasswords"
      );
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNECTION") {
      console.error("⚠️  Connection timeout. This could be due to:");
      console.error("   1. Network issues on Render");
      console.error("   2. Gmail blocking the connection");
      console.error("   3. Firewall or security settings");
      console.error("💡 Consider using SendGrid or another email service for production");
    }

    console.error("Full Error:", error);
    console.error("--- EMAIL SERVICE ERROR END ---\n");

    return {
      success: false,
      error: error.message,
      errorType: error.code || error.name,
    };
  }
};

// Test function to verify email service
const testEmailService = async () => {
  console.log("\n🧪 Testing Email Service...");

  try {
    if (!transporter) {
      throw new Error("Transporter not initialized");
    }

    await transporter.verify();
    console.log("✅ Email service is ready!");
    return true;
  } catch (error) {
    console.error("❌ Email service test failed:", error.message);
    if (error.code === "EAUTH") {
      console.error("💡 Check your Gmail App Password");
    }
    return false;
  }
};

export { sendNewPoemNotification, testEmailService };