export interface FollowState {
  shop_ids: string[];
  last_checked_notifications: string;
}

const STORAGE_KEY = 'afus_followers';

function getFollowState(): FollowState {
  if (typeof window === 'undefined') return { shop_ids: [], last_checked_notifications: new Date(0).toISOString() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { shop_ids: [], last_checked_notifications: new Date().toISOString() };
}

function setFollowState(state: FollowState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isFollowing(shopId: string): boolean {
  return getFollowState().shop_ids.includes(shopId);
}

export function toggleFollow(shopId: string): boolean {
  const state = getFollowState();
  if (state.shop_ids.includes(shopId)) {
    state.shop_ids = state.shop_ids.filter(id => id !== shopId);
    setFollowState(state);
    return false;
  } else {
    state.shop_ids.push(shopId);
    setFollowState(state);
    return true;
  }
}

export function getFollowedShops(): string[] {
  return getFollowState().shop_ids;
}

export function getLastCheckedNotifications(): string {
  return getFollowState().last_checked_notifications;
}

export function updateLastCheckedNotifications() {
  const state = getFollowState();
  state.last_checked_notifications = new Date().toISOString();
  setFollowState(state);
}
