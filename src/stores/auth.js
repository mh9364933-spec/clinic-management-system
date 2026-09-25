// stores/auth.js
// Pinia store holding the logged-in doctor's profile and auth state.
// Persisted to localStorage so a page refresh doesn't log the doctor out.
import { defineStore } from 'pinia'

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/initials/svg?seed=Doctor&backgroundColor=2563eb'

const STORAGE_KEY = 'medicare_auth'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Could not read saved auth state:', e)
    return null
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Could not persist auth state:', e)
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Could not clear saved auth state:', e)
  }
}

// نحاول نقرأ حالة تسجيل الدخول المحفوظة قبل أي حاجة، عشان الـ state
// يبدأ صح من أول render بدل ما يبان "Log In" لحظة وبعدين يتبدل
const saved = loadFromStorage()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: saved?.isAuthenticated || false,
    doctor: saved?.doctor || {
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
      saveToStorage({ isAuthenticated: this.isAuthenticated, doctor: this.doctor })
    },

    // Used by the "Edit Profile" flow in the drawer
    updateProfile(profile) {
      this.doctor = { ...this.doctor, ...profile }
      saveToStorage({ isAuthenticated: this.isAuthenticated, doctor: this.doctor })
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
      clearStorage()
    },
  },
})