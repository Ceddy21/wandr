// Fired whenever the user object changes (avatar, name, etc.)
export const PROFILE_UPDATED_EVENT = 'profileUpdated';

/**
 * Update the user in localStorage AND notify the Header
 * (and any other listener) so it re-renders instantly.
 */
export function syncUser(user) {
  if (!user) {
    localStorage.removeItem('user');
  } else {
    localStorage.setItem('user', JSON.stringify(user));
  }

  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, { detail: { user } })
  );
}