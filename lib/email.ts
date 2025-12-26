import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function send2FACode(email: string, code: string) {
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@namelessesports.com",
        subject: "Your Nameless Esports 2FA Code",
        text: `Your 2FA verification code is: ${code}. This code will expire in 5 minutes.`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Nameless Esports</h2>
        <p>Your 2FA verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #8b5cf6; font-size: 32px; letter-spacing: 8px; margin: 0;">${code}</h1>
        </div>
        <p style="color: #6b7280;">This code will expire in <strong>5 minutes</strong>.</p>
        <p style="color: #6b7280; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error("SendGrid error:", error);
        return { success: false, error };
    }
}

export async function sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@namelessesports.com",
        subject: "Verify your Nameless Esports account",
        text: `Please verify your email by clicking this link: ${verifyUrl}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Welcome to Nameless Esports!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 12px;">Or copy and paste this URL: ${verifyUrl}</p>
        <p style="color: #6b7280; font-size: 12px;">This link will expire in 24 hours.</p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error("SendGrid error:", error);
        return { success: false, error };
    }
}
