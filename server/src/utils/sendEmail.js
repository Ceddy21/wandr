import { google } from 'googleapis';

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

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    const emailLines = [];
    emailLines.push(`From: "Wanderly" <${USER_EMAIL}>`);
    emailLines.push(`To: ${toEmail}`);
    emailLines.push('Subject: Verify Your Wanderly Account');
    emailLines.push('MIME-Version: 1.0');
    emailLines.push('Content-Type: text/html; charset=UTF-8');
    emailLines.push('');
    emailLines.push(`
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #E76F51;">Welcome to Wanderly!</h2>
        <p>Please use the following code to verify your email:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
          ${code}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
        <hr />
        <p style="color: #999; font-size: 12px;">Wanderly – Plan your adventures with friends.</p>
      </div>
    `);

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
  } catch (error) {
    console.error('Email error:', error.message);
    throw new Error('Failed to send verification email.');
  }
};