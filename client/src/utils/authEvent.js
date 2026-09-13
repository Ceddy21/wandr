export const PROFILE_UPDATED_EVENT = 'profileUpdated';

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