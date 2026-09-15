import { google } from 'googleapis';
import dotenv from 'dotenv';
import crypto from 'crypto';

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

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: 'v1',
  auth: oAuth2Client,
});

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

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const encodeSubject = (subject) =>
  `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;

const createMessageId = () => {
  const domain = USER_EMAIL?.split('@')[1] || 'gmail.com';
  return `<${crypto.randomUUID()}@${domain}>`;
};

const buildEmailHtml = ({
  preheader = '',
  accent = BRAND.terracotta,
  heading,
  intro,
  code,
  footer,
  warning = null,
}) => {
  const safePreheader = escapeHtml(preheader);
  const safeHeading = escapeHtml(heading);
  const safeIntro = escapeHtml(intro);
  const safeCode = escapeHtml(code);
  const safeWarning = warning ? escapeHtml(warning) : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  <meta
    name="x-apple-disable-message-reformatting"
  >
  <meta
    name="format-detection"
    content="telephone=no,date=no,address=no,email=no,url=no"
  >
  <title>${safeHeading}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    width:100%;
    background-color:${BRAND.bg};
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;
  "
>
  <!-- Preheader -->
  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
      color:transparent;
      mso-hide:all;
      font-size:1px;
      line-height:1px;
    "
  >
    ${safePreheader}
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width:100%;
      background-color:${BRAND.bg};
      margin:0;
      padding:0;
    "
  >
    <tr>
      <td
        align="center"
        style="
          padding:40px 16px;
        "
      >

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:560px;
            margin:0 auto;
          "
        >

          <!-- Logo -->
          <tr>
            <td
              align="center"
              style="
                padding:0 0 22px;
              "
            >
              <img
                src="${LOGO_URL}"
                width="120"
                alt="Wandr"
                style="
                  display:block;
                  width:120px;
                  max-width:120px;
                  height:auto;
                  margin:0 auto;
                  border:0;
                  outline:none;
                  text-decoration:none;
                "
              >
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td
              style="
                background-color:${BRAND.white};
                border:1px solid ${BRAND.border};
                border-radius:16px;
                overflow:hidden;
              "
            >

              <!-- Accent Bar -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    style="
                      height:4px;
                      background-color:${accent};
                      font-size:0;
                      line-height:0;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>
              </table>

              <!-- Content -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <!-- Heading -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding:36px 32px 12px;
                    "
                  >
                    <h1
                      style="
                        margin:0;
                        padding:0;
                        font-family:Georgia,'Times New Roman',serif;
                        font-size:27px;
                        line-height:36px;
                        font-weight:700;
                        color:${BRAND.charcoal};
                      "
                    >
                      ${safeHeading}
                    </h1>
                  </td>
                </tr>

                <!-- Introduction -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding:0 32px 28px;
                    "
                  >
                    <p
                      style="
                        margin:0;
                        padding:0;
                        font-size:15px;
                        line-height:24px;
                        color:${BRAND.grey};
                      "
                    >
                      ${safeIntro}
                    </p>
                  </td>
                </tr>

                <!-- Verification Code -->
                <tr>
                  <td
                    style="
                      padding:0 32px;
                    "
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        width:100%;
                        background-color:${BRAND.lightGrey};
                        border:1px solid ${BRAND.border};
                        border-radius:12px;
                      "
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            padding:24px 16px;
                          "
                        >

                          <p
                            style="
                              margin:0 0 8px;
                              padding:0;
                              font-size:11px;
                              line-height:16px;
                              font-weight:600;
                              letter-spacing:1.2px;
                              text-transform:uppercase;
                              color:${BRAND.grey};
                            "
                          >
                            Verification code
                          </p>

                          <div
                            style="
                              font-family:'Courier New',Courier,monospace;
                              font-size:34px;
                              line-height:42px;
                              font-weight:700;
                              letter-spacing:8px;
                              color:${BRAND.charcoal};
                            "
                          >
                            ${safeCode}
                          </div>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Expiration / Info -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding:24px 32px 20px;
                    "
                  >
                    <p
                      style="
                        margin:0;
                        padding:0;
                        font-size:13px;
                        line-height:21px;
                        color:${BRAND.grey};
                      "
                    >
                      ${footer}
                    </p>
                  </td>
                </tr>

                ${
                  safeWarning
                    ? `
                <!-- Security Warning -->
                <tr>
                  <td
                    style="
                      padding:0 32px 24px;
                    "
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        width:100%;
                        background-color:#FEF2F2;
                        border:1px solid #FECACA;
                        border-radius:10px;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding:13px 15px;
                          "
                        >
                          <p
                            style="
                              margin:0;
                              padding:0;
                              font-size:13px;
                              line-height:20px;
                              color:#991B1B;
                            "
                          >
                            ${safeWarning}
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
                  <td
                    style="
                      padding:0 32px;
                    "
                  >
                    <div
                      style="
                        height:1px;
                        background-color:${BRAND.border};
                        font-size:0;
                        line-height:0;
                      "
                    >
                      &nbsp;
                    </div>
                  </td>
                </tr>

                <!-- Brand Message -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding:20px 32px 28px;
                    "
                  >
                    <p
                      style="
                        margin:0;
                        padding:0;
                        font-size:12px;
                        line-height:18px;
                        color:#9CA3AF;
                      "
                    >
                      Plan your adventures with friends.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- Email Footer -->
          <tr>
            <td
              align="center"
              style="
                padding:18px 20px 0;
              "
            >
              <p
                style="
                  margin:0;
                  padding:0;
                  font-size:11px;
                  line-height:18px;
                  color:#9CA3AF;
                "
              >
                This email was sent automatically by Wandr.
              </p>

              <p
                style="
                  margin:4px 0 0;
                  padding:0;
                  font-size:11px;
                  line-height:18px;
                  color:#9CA3AF;
                "
              >
                © ${new Date().getFullYear()} Wandr. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

const stripHtml = (html) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const buildPlainText = ({
  heading,
  intro,
  code,
  footer,
  warning = null,
}) => {
  const parts = [
    heading,
    '',
    intro,
    '',
    `Verification code: ${code}`,
    '',
    stripHtml(footer),
  ];

  if (warning) {
    parts.push('', warning);
  }

  parts.push('', 'Wandr');

  return parts.join('\n');
};

const sendEmail = async ({
  toEmail,
  subject,
  html,
  text,
}) => {
  const boundary = `WandrBoundary_${crypto.randomUUID()}`;
  const messageId = createMessageId();
  const date = new Date().toUTCString();

  const emailLines = [
    `From: "Wandr" <${USER_EMAIL}>`,
    `To: ${toEmail}`,
    `Subject: ${encodeSubject(subject)}`,
    `Date: ${date}`,
    `Message-ID: ${messageId}`,
    'MIME-Version: 1.0',
    'Auto-Submitted: auto-generated',
    'X-Auto-Response-Suppress: All',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
    '',
    `--${boundary}--`,
  ];

  const email = emailLines.join('\r\n');

  const base64Email = Buffer.from(email, 'utf8')
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

  console.log('Email sent successfully:', response.data.id);

  return {
    success: true,
    messageId: response.data.id,
  };
};

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    const subject = 'Your Wandr verification code';

    const intro =
      'Thanks for signing up. Use the verification code below to confirm your email address and continue setting up your Wandr account.';

    const footer =
      'This code expires in <strong>10 minutes</strong>.<br>If you did not create a Wandr account, you can safely ignore this email.';

    const html = buildEmailHtml({
      preheader: `Your Wandr verification code is ${code}`,
      accent: BRAND.terracotta,
      heading: 'Verify your email',
      intro,
      code,
      footer,
    });

    const text = buildPlainText({
      heading: 'Verify your email',
      intro,
      code,
      footer,
    });

    return await sendEmail({
      toEmail,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Verification email error:', error.message);
    throw new Error('Failed to send verification email.');
  }
};

export const sendAccountDeletionEmail = async (toEmail, code) => {
  try {
    const subject = 'Confirm your Wandr account deletion';

    const intro =
      'Use the verification code below to confirm that you want to delete your Wandr account and associated data.';

    const footer =
      'This code expires in <strong>10 minutes</strong>.';

    const warning =
      'If you did not request this, ignore this email and secure your account.';

    const html = buildEmailHtml({
      preheader: `Your Wandr account deletion code is ${code}`,
      accent: BRAND.red,
      heading: 'Delete your account?',
      intro,
      code,
      footer,
      warning,
    });

    const text = buildPlainText({
      heading: 'Delete your account?',
      intro,
      code,
      footer,
      warning,
    });

    return await sendEmail({
      toEmail,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Deletion email error:', error.message);
    throw new Error('Failed to send deletion confirmation email.');
  }
};

export const sendPasswordResetEmail = async (toEmail, code) => {
  try {
    const subject = 'Your Wandr password reset code';

    const intro =
      'We received a request to reset your Wandr password. Use the verification code below to continue.';

    const footer =
      'This code expires in <strong>10 minutes</strong>.<br>If you did not request a password reset, you can safely ignore this email. Your password will not change.';

    const html = buildEmailHtml({
      preheader: `Your Wandr password reset code is ${code}`,
      accent: BRAND.terracotta,
      heading: 'Reset your password',
      intro,
      code,
      footer,
    });

    const text = buildPlainText({
      heading: 'Reset your password',
      intro,
      code,
      footer,
    });

    return await sendEmail({
      toEmail,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Password reset email error:', error.message);
    throw new Error('Failed to send password reset email.');
  }
};