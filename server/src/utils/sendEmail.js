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
  red: '#DC2626',
  charcoal: '#1A1A1A',
  grey: '#6B7280',
  lightGrey: '#F3F4F6',
  border: '#E5E7EB',
  bg: '#F7F8F6',
  white: '#FFFFFF',
};

const LOGO_URL =
  'https://res.cloudinary.com/sqlrnnth/image/upload/v1789228245/wandr_nologo.png';

const buildEmailHtml = ({
  preheader = '',
  accent = BRAND.terracotta,
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
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
  <title>${heading}</title>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.bg}; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">

  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">

          <tr>
            <td align="center" style="padding:0 0 24px;">
              <img
                src="${LOGO_URL}"
                alt="Wandr"
                width="150"
                style="display:block; width:150px; max-width:150px; height:auto; border:0; outline:none; text-decoration:none;"
              />
            </td>
          </tr>

          <tr>
            <td style="background-color:${BRAND.white}; border:1px solid ${BRAND.border}; border-radius:18px; overflow:hidden;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:4px; background-color:${accent}; font-size:0; line-height:0;">
                    &nbsp;
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:40px 40px 12px;">
                    <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:28px; line-height:36px; font-weight:700; color:${BRAND.charcoal};">
                      ${heading}
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:0 40px 32px;">
                    <p style="margin:0; font-size:15px; line-height:24px; color:${BRAND.grey};">
                      ${intro}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.lightGrey}; border:1px dashed #D1D5DB; border-radius:14px;">
                      <tr>
                        <td align="center" style="padding:28px 20px;">
                          <p style="margin:0 0 10px; font-size:11px; line-height:16px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:${BRAND.grey};">
                            Verification code
                          </p>
                          <div style="font-family:'Courier New', Courier, monospace; font-size:38px; line-height:46px; font-weight:700; letter-spacing:10px; color:${BRAND.charcoal};">
                            ${code}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:28px 40px 24px;">
                    <p style="margin:0; font-size:13px; line-height:21px; color:${BRAND.grey};">
                      ${footer}
                    </p>
                  </td>
                </tr>

                ${
                  warning
                    ? `
                <tr>
                  <td style="padding:0 40px 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FEF2F2; border:1px solid #FECACA; border-radius:10px;">
                      <tr>
                        <td style="padding:14px 16px;">
                          <p style="margin:0; font-size:13px; line-height:20px; color:#991B1B;">
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

                <tr>
                  <td style="padding:0 40px;">
                    <div style="height:1px; background-color:${BRAND.border}; font-size:0; line-height:0;">
                      &nbsp;
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:24px 40px 32px;">
                    <p style="margin:0; font-size:13px; line-height:20px; color:${BRAND.grey};">
                      Plan your adventures with friends.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 20px 0;">
              <p style="margin:0; font-size:11px; line-height:18px; color:#9CA3AF;">
                This is an automated message. Please don't reply to this email.
              </p>
              <p style="margin:5px 0 0; font-size:11px; line-height:18px; color:#9CA3AF;">
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
    requestBody: {
      raw: base64Email,
    },
  });

  console.log('Email sent!', response.data.id);

  return {
    success: true,
    messageId: response.data.id,
  };
};

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    return await sendEmail(
      toEmail,
      'Verify your Wandr account',
      buildEmailHtml({
        preheader: `Your Wandr verification code is ${code}`,
        accent: BRAND.terracotta,
        heading: 'Welcome to Wandr',
        intro:
          'Thanks for signing up. Enter the verification code below to confirm your email address and start planning your trips.',
        code,
        footer:
          'This code expires in <strong>10 minutes</strong>.<br />If you didn\'t create a Wandr account, you can safely ignore this email.',
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
        preheader: `Confirm your Wandr account deletion with code ${code}`,
        accent: BRAND.red,
        heading: 'Delete your account?',
        intro:
          'Enter the code below to confirm the deletion of your Wandr account and associated data. This action cannot be undone.',
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
export const sendPasswordResetEmail = async (toEmail, code) => {
  try {
    return await sendEmail(
      toEmail,
      'Reset your Wandr password',
      buildEmailHtml({
        preheader: `Your Wandr password reset code is ${code}`,
        accent: BRAND.terracotta,
        heading: 'Reset your password',
        intro:
          'We received a request to reset your Wandr password. Enter the code below to choose a new one.',
        code,
        footer:
          'This code expires in <strong>10 minutes</strong>.<br />If you didn\'t request a reset, you can safely ignore this email — your password won\'t change.',
      })
    );
  } catch (error) {
    console.error('Password reset email error:', error.message);
    throw new Error('Failed to send password reset email.');
  }
};