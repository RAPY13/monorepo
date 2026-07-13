import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@rapyard.club";

/**
 * Send token_hash-based magic link email (shorter, cleaner links)
 */
export async function sendMagicLinkEmail(
    email: string,
    tokenHash: string,
    baseUrl: string,
    username?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const name = username || email.split("@")[0];
        const magicLink = `${baseUrl}/auth/confirm?token_hash=${tokenHash}&type=email`;

        const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050505; color: #fff; }
      .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
      .header { text-align: center; margin-bottom: 40px; }
      .logo { font-size: 28px; font-weight: 900; letter-spacing: 0.15em; color: #fbbf24; margin-bottom: 10px; }
      .subtitle { color: #9ca3af; font-size: 14px; letter-spacing: 0.1em; }
      .content { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 40px; text-align: center; }
      .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; }
      .message { color: #d1d5db; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
      .cta-button { display: inline-block; background: #fbbf24; color: #000; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; letter-spacing: 0.1em; font-size: 14px; margin: 20px 0; transition: background 0.3s; }
      .cta-button:hover { background: #f59e0b; }
      .code-section { margin: 30px 0; padding: 20px; background: #0a0a0a; border-left: 3px solid #fbbf24; border-radius: 4px; }
      .code { font-family: 'Courier New', monospace; font-size: 12px; word-break: break-all; color: #fbbf24; }
      .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; }
      .warning { color: #fca5a5; font-size: 12px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">RAPYARD</div>
        <div class="subtitle">WHERE BARS GET BUILT</div>
      </div>

      <div class="content">
        <div class="greeting">Clock in, ${name}</div>
        <div class="message">
          Your magic link is ready. Click below to enter The Yard and start building bars.
        </div>

        <a href="${magicLink}" class="cta-button">Enter The Yard</a>

        <div class="code-section">
          <div style="color: #9ca3af; font-size: 12px; margin-bottom: 10px;">Or copy this link:</div>
          <div class="code">${magicLink}</div>
        </div>

        <div class="warning">
          ⏱️ This link expires in 24 hours.<br>
          🔒 Never share this link with anyone.
        </div>
      </div>

      <div class="footer">
        <p>If you didn't request this email, you can safely ignore it.</p>
        <p style="margin-top: 10px; color: #4b5563;">© 2026 RapYard. Where bars get built.</p>
      </div>
    </div>
  </body>
</html>
        `;

        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: "🎤 Clock in to RapYard — Your magic link is ready",
            html,
        });

        if (error) {
            console.error("Resend error:", error);
            return {
                success: false,
                error: `Failed to send email: ${error.message}`,
            };
        }

        return { success: true };
    } catch (err) {
        console.error("Email service error:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown email service error",
        };
    }
}

/**
 * Send welcome email after signup
 */
export async function sendWelcomeEmail(
    email: string,
    username?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const name = username || email.split("@")[0];

        const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050505; color: #fff; }
      .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
      .content { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 40px; }
      .welcome { font-size: 24px; font-weight: 900; color: #fbbf24; margin-bottom: 20px; }
      .text { color: #d1d5db; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
      .feature { background: #0a0a0a; padding: 15px; border-left: 3px solid #fbbf24; margin: 15px 0; }
      .feature-title { color: #fbbf24; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <div class="welcome">Welcome to RapYard, ${name}</div>
        <div class="text">You're officially locked in. The Yard is ready for you.</div>

        <div class="feature">
          <div class="feature-title">🎙️ THE BOOTH</div>
          <div class="text" style="margin: 0; font-size: 14px;">Record instantly. No overthinking. Just bars.</div>
        </div>

        <div class="feature">
          <div class="feature-title">⚔️ THE PIT</div>
          <div class="text" style="margin: 0; font-size: 14px;">Battle 1v1. Win ELO. Earn your crown.</div>
        </div>

        <div class="feature">
          <div class="feature-title">🎧 THE YARD</div>
          <div class="text" style="margin: 0; font-size: 14px;">Discover beats. Find your sound. Build tapes.</div>
        </div>

        <div class="text" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
          <strong>Everything a rapper needs. Nothing they don't.</strong>
        </div>
      </div>
    </div>
  </body>
</html>
    `;

        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: "🚀 Welcome to RapYard",
            html,
        });

        if (error) {
            console.error("Resend error:", error);
            return {
                success: false,
                error: `Failed to send email: ${error.message}`,
            };
        }

        return { success: true };
    } catch (err) {
        console.error("Email service error:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown email service error",
        };
    }
}
