import { signOut } from './authService';

/**
 * Idle Timeout Service
 * Tracks user activity and logs out after a specified period of inactivity.
 */

const IDLE_TIME_LIMIT = 30 * 60 * 1000; // 30 minutes in milliseconds
let idleTimer = null;

const events = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click'
];

/**
 * Clears existing tokens and redirects to login
 */
const logout = async () => {
  console.log('Sessão expirada por inatividade.');
  await signOut();
  
  // Force reload to login page
  window.location.href = '/#/login';
  window.location.reload();
};

/**
 * Resets the inactivity timer
 */
const resetTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);
  
  // Only set timer if user is logged in
  if (localStorage.getItem('userToken')) {
    idleTimer = setTimeout(logout, IDLE_TIME_LIMIT);
  }
};

/**
 * Initializes the idle tracker
 */
export const initIdleTracker = () => {
  // Add event listeners to reset the timer on activity
  events.forEach(event => {
    window.addEventListener(event, resetTimer, { passive: true });
  });

  // Initial timer start
  resetTimer();
  
  console.log('Idle Tracker iniciado (30 min)');
};

/**
 * Cleanup function (if needed)
 */
export const destroyIdleTracker = () => {
  events.forEach(event => {
    window.removeEventListener(event, resetTimer);
  });
  if (idleTimer) clearTimeout(idleTimer);
};
