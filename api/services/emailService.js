import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: "https://api.mailgun.net", // Use US endpoint (default)
});

export const sendLeaveRequestNotification = async (leaveData, employeeData) => {
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: [process.env.ADMIN_EMAIL],
      subject: `🔔 New Leave Request from ${
        employeeData.name || leaveData.empRef
      }`,
      text: `New Leave Request

Employee: ${employeeData.name || "N/A"} (${leaveData.empRef})
From Date: ${new Date(leaveData.fromDate).toLocaleDateString()}
To Date: ${new Date(leaveData.toDate).toLocaleDateString()}
Days: ${leaveData.days}
Reason: ${leaveData.reason}

Please log into the HRMS system to review and approve/reject this request.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #4F46E5; }
            .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 10px 0 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Leave Request</h1>
            </div>
            <div class="content">
              <p>A new leave request has been submitted and requires your attention.</p>
              
              <div class="info-row">
                <span class="label">Employee:</span> ${
                  employeeData.name || "N/A"
                }
              </div>
              <div class="info-row">
                <span class="label">Employee ID:</span> ${leaveData.empRef}
              </div>
              <div class="info-row">
                <span class="label">From Date:</span> ${new Date(
                  leaveData.fromDate
                ).toLocaleDateString()}
              </div>
              <div class="info-row">
                <span class="label">To Date:</span> ${new Date(
                  leaveData.toDate
                ).toLocaleDateString()}
              </div>
              <div class="info-row">
                <span class="label">Number of Days:</span> ${leaveData.days}
              </div>
              <div class="info-row">
                <span class="label">Reason:</span> ${leaveData.reason}
              </div>
              
              <p style="margin-top: 30px;">Please log in to the HRMS system to review and approve/reject this request.</p>
              
              <a href="${
                process.env.CLIENT_URL
              }/home/view-all-leaves" class="button">Review Request</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("📧 Email notification sent successfully:", data.id);
    console.log("📧 Email details:", {
      from: `postmaster@${process.env.MAILGUN_DOMAIN}`,
      to: process.env.ADMIN_EMAIL,
      status: data.message || "Queued. Check Mailgun logs for delivery status.",
    });
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("❌ Error sending email via Mailgun:", error);
    return { success: false, error: error.message };
  }
};

export const sendLeaveStatusNotification = async (leaveData, employeeData) => {
  const statusColor =
    leaveData.status.toLowerCase() === "approved" ? "#10B981" : "#EF4444";
  const statusEmoji =
    leaveData.status.toLowerCase() === "approved" ? "✅" : "❌";

  const emailData = {
    from: `HRMS System <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    to: employeeData.email,
    subject: `${statusEmoji} Leave Request ${leaveData.status} - HRMS`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: ${statusColor}; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusEmoji} Leave Request ${leaveData.status}</h1>
          </div>
          <div class="content">
            <p>Hello ${employeeData.name},</p>
            <p>Your leave request has been <strong>${leaveData.status.toLowerCase()}</strong>.</p>
            
            <div class="info-row">
              <span class="label">From Date:</span> ${new Date(
                leaveData.fromDate
              ).toLocaleDateString()}
            </div>
            <div class="info-row">
              <span class="label">To Date:</span> ${new Date(
                leaveData.toDate
              ).toLocaleDateString()}
            </div>
            <div class="info-row">
              <span class="label">Number of Days:</span> ${leaveData.days}
            </div>
            <div class="info-row">
              <span class="label">Status:</span> <span style="color: ${statusColor}; font-weight: bold;">${
      leaveData.status
    }</span>
            </div>
            
            <p style="margin-top: 30px;">
              ${
                leaveData.status.toLowerCase() === "approved"
                  ? "Enjoy your time off!"
                  : "Please contact HR if you have any questions."
              }
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const response = await mg.messages.create(
      process.env.MAILGUN_DOMAIN,
      emailData
    );
    console.log("📧 Status notification sent successfully:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Error sending status notification:", error);
    throw error;
  }
};
