// stores/auth.js
// Pinia store holding the logged-in doctor's profile and auth state.
import { defineStore } from 'pinia'

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/initials/svg?seed=Doctor&backgroundColor=2563eb'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    doctor: {
      name: '',
      specialty: '',
      email: '',
      phone: '',
      avatar: DEFAULT_AVATAR,
    },
  }),

  getters: {
    // Two-letter initials shown in the nav bar avatar circle before a real image loads
    initials: (state) => {
      if (!state.doctor.name) return 'DR'
      return state.doctor.name
        .replace(/^Dr\.?\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join('') || 'DR'
    },
  },

  actions: {
    // Called on login-form submit
    login(profile) {
      this.doctor = {
        name: profile.name?.trim() || 'Dr. Unknown',
        specialty: profile.specialty?.trim() || 'General Practice',
        email: profile.email?.trim() || '',
        phone: profile.phone?.trim() || '',
        avatar: profile.avatar || DEFAULT_AVATAR,
      }
      this.isAuthenticated = true
    },

    // Used by the "Edit Profile" flow in the drawer
    updateProfile(profile) {
      this.doctor = { ...this.doctor, ...profile }
    },

    logout() {
      this.isAuthenticated = false
      this.doctor = {
        name: '',
        specialty: '',
        email: '',
        phone: '',
        avatar: DEFAULT_AVATAR,
      }
    },
  },
})