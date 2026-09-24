// stores/ui.js
// Small shared store so the mobile hamburger button (in the navbar)
// can open/close the sidebar regardless of which page is rendering it.
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: false,
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    closeSidebar() {
      this.isSidebarOpen = false
    },
    openSidebar() {
      this.isSidebarOpen = true
    },
  },
})