<template>
  <span :class="['status-badge', statusClass]">
    <span class="status-dot"></span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    default: "waiting"
  }
});

const statusClass = computed(() => {
  switch (props.status.toLowerCase()) {
    case "completed":
      return "status-completed";

    case "cancelled":
      return "status-cancelled";

    case "waiting":
      return "status-waiting";

    default:
      return "status-default";
  }
});

const statusText = computed(() => {
  switch (props.status.toLowerCase()) {
    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "waiting":
      return "Waiting";

    default:
      return props.status;
  }
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Dot */
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

/* Waiting */
.status-waiting {
  background: #fff4d6;
  color: #c58a00;
}

/* Completed */
.status-completed {
  background: #e8f7ee;
  color: #2e9d5b;
}

/* Cancelled */
.status-cancelled {
  background: #fdeaea;
  color: #d9534f;
}

/* Unknown status */
.status-default {
  background: #f1f3f5;
  color: #6c757d;
}
</style>