// ── Environment configuration for Development ─────────────────────────────────
// Use this file for local development settings

export const environment = {
  production: false,
  baseUrl: 'http://192.168.29.6:3000/api/v1',

  // Centralized endpoints for easy maintenance
  endpoints: {
    auth: {
    register: '/auth/register',
    login: '/auth/login',
    },
    groups: {
      list: '/groups/list',
      create: '/groups/create',
    },
    events: {
      list: '/events/list',
      create: '/events/create',
    },
  }
};