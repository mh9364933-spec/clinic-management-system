<template>
  <div class="empty-state">

    <!-- Icon -->
    <div class="empty-icon">
      <i :class="icon"></i>
    </div>

    <!-- Text -->
    <h3>{{ title }}</h3>

    <p>
      {{ message }}
    </p>

    <!-- Optional Button -->
    <button
      v-if="buttonText"
      class="empty-btn"
      @click="$emit('action')"
    >
      <i v-if="buttonIcon" :class="buttonIcon"></i>
      {{ buttonText }}
    </button>

  </div>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: "No Data Found"
  },

  message: {
    type: String,
    default: "There is no data to display right now."
  },

  icon: {
    type: String,
    default: "bi bi-inbox"
  },

  buttonText: {
    type: String,
    default: ""
  },

  buttonIcon: {
    type: String,
    default: "bi bi-plus-lg"
  }
});

defineEmits(["action"]);

</script>

<style scoped>

.empty-state {
  min-height: 280px;
  padding: 40px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.empty-icon {
  width: 70px;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eef6ff;
  color: #1976d2;

  font-size: 28px;

  margin-bottom: 18px;
}

.empty-state h3 {
  margin: 0 0 8px;

  font-size: 17px;
  font-weight: 600;

  color: #263238;
}

.empty-state p {
  max-width: 400px;

  margin: 0 0 20px;

  color: #8a96a6;
  font-size: 13px;
  line-height: 1.6;
}

.empty-btn {
  border: none;

  padding: 10px 17px;

  border-radius: 8px;

  background: #1976d2;
  color: white;

  font-size: 12px;
  font-weight: 500;

  display: flex;
  align-items: center;
  gap: 7px;

  cursor: pointer;
}

.empty-btn:hover {
  background: #1565c0;
}

</style>