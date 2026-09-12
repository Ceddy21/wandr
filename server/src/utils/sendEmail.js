import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const USER_EMAIL = process.env.GMAIL_USER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

const BRAND = {
  green: '#2D6A4F',
  terracotta: '#E76F51',
  red: '#dc2626',
  charcoal: '#1A1A1A',
  grey: '#6B7280',
  lightGrey: '#F3F4F6',
  border: '#E5E7EB',
  bg: '#F9FAFB',
};

const buildEmailHtml = ({
  preheader = '',
  accent = BRAND.terracotta,
  icon = '✈️',
  heading,
  intro,
  code,
  footer,
  warning = null,
}) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${heading}</title>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${preheader}
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.bg}; padding: 40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid ${BRAND.border};">

          <!-- Accent bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, ${BRAND.green} 0%, ${accent} 100%);"></td>
          </tr>

          <!-- Brand header -->
          <tr>
            <td align="center" style="padding: 32px 32px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.terracotta} 100%); display: inline-block; text-align: center; line-height: 36px; font-size: 18px;">
                      ${icon}
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 700; color: ${BRAND.charcoal}; letter-spacing: -0.5px;">
                      Wandr
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding: 24px 32px 8px;">
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; line-height: 1.3; font-weight: 700; color: ${BRAND.charcoal};">
                ${heading}
              </h1>
            </td>
          </tr>

          <!-- Intro text -->
          <tr>
            <td align="center" style="padding: 8px 32px 24px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${BRAND.grey};">
                ${intro}
              </p>
            </td>
          </tr>

          <!-- Code box -->
          <tr>
            <td align="center" style="padding: 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color: ${BRAND.lightGrey}; border: 2px dashed ${BRAND.border}; border-radius: 12px; padding: 24px 16px;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 700; letter-spacing: 12px; color: ${BRAND.charcoal}; line-height: 1;">
                      ${code}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer message -->
          <tr>
            <td align="center" style="padding: 24px 32px 16px;">
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: ${BRAND.grey};">
                ${footer}
              </p>
            </td>
          </tr>

          ${
            warning
              ? `
          <!-- Warning callout -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF2F2; border-left: 3px solid ${BRAND.red}; border-radius: 6px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #991B1B; font-weight: 500;">
                      ${warning}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="height: 1px; background-color: ${BRAND.border};"></div>
            </td>
          </tr>

          <!-- App tagline -->
          <tr>
            <td align="center" style="padding: 24px 32px 12px;">
              <p style="margin: 0; font-size: 13px; color: ${BRAND.grey};">
                Plan your adventures with friends.
              </p>
            </td>
          </tr>

          <!-- Bottom spacing -->
          <tr>
            <td style="padding: 0 0 32px;"></td>
          </tr>

        </table>

        <!-- Footer below card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; margin-top: 16px;">
          <tr>
            <td align="center" style="padding: 8px 16px;">
              <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #9CA3AF;">
                This is an automated message. Please don't reply to this email.
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #9CA3AF;">
                © ${new Date().getFullYear()} Wandr · All rights reserved
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

const sendEmail = async (toEmail, subject, html) => {
  const emailLines = [
    `From: "Wandr" <${USER_EMAIL}>`,
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ];

  const email = emailLines.join('\r\n');
  const base64Email = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: base64Email },
  });

  console.log('Email sent!', response.data.id);
  return { success: true, messageId: response.data.id };
};

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    return await sendEmail(
      toEmail,
      'Verify your Wandr account',
      buildEmailHtml({
        preheader: `Your Wandr verification code is ${code}`,
        accent: BRAND.terracotta,
        icon: '✈️',
        heading: 'Welcome to Wandr',
        intro:
          'Thanks for signing up! Enter the code below to verify your email and start planning your trips.',
        code,
        footer:
          'This code expires in <strong>10 minutes</strong>.<br />If you didn\'t create an account, you can safely ignore this email.',
      })
    );
  } catch (error) {
    console.error('Email error:', error.message);
    throw new Error('Failed to send verification email.');
  }
};

export const sendAccountDeletionEmail = async (toEmail, code) => {
  try {
    return await sendEmail(
      toEmail,
      'Confirm your Wandr account deletion',
      buildEmailHtml({
        preheader: `Confirm account deletion with code ${code}`,
        accent: BRAND.red,
        icon: '⚠️',
        heading: 'Delete your account?',
        intro:
          'Enter the code below to confirm deletion of your Wandr account and all associated data. This action is permanent.',
        code,
        footer: 'This code expires in <strong>10 minutes</strong>.',
        warning:
          'If you didn\'t request this, ignore this email and change your password immediately.',
      })
    );
  } catch (error) {
    console.error('Deletion email error:', error.message);
    throw new Error('Failed to send deletion confirmation email.');
  }
};