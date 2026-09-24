// stores/notifications.js
// Pinia store for the notification bell + dropdown.
import { defineStore } from 'pinia'

let nextId = 1

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [
      // seeded example so the dropdown isn't empty on first load
      {
        id: nextId++,
        title: 'Welcome to MediCare',
        message: 'Your clinic dashboard is ready to go.',
        createdAt: Date.now() - 1000 * 60 * 45,
        read: true,
      },
    ],
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.read).length,
    // newest first
    sorted: (state) => [...state.notifications].sort((a, b) => b.createdAt - a.createdAt),
  },

  actions: {
    push(title, message) {
      this.notifications.unshift({
        id: nextId++,
        title,
        message,
        createdAt: Date.now(),
        read: false,
      })
    },
    markAllRead() {
      this.notifications.forEach((n) => (n.read = true))
    },
    markRead(id) {
      const n = this.notifications.find((n) => n.id === id)
      if (n) n.read = true
    },
    clearAll() {
      this.notifications = []
    },
  },
})