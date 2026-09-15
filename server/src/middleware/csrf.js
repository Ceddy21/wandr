import { doubleCsrf } from 'csrf-csrf';

const {
  generateCsrfToken,
  doubleCsrfProtection,
  invalidCsrfTokenError,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.JWT_SECRET,
  getSessionIdentifier: (req) => {
    const ua = req.headers['user-agent'] || '';
    const lang = req.headers['accept-language'] || '';
    return `${ua}|${lang}`;
  },
  cookieName: 'wandr_csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: process.env.COOKIE_SAME_SITE || 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 1000,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

export { generateCsrfToken, invalidCsrfTokenError };
export const csrfProtection = doubleCsrfProtection;