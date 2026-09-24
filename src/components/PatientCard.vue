<template>

  <div
    class="patient-card"
    :class="{ compact }"
  >

    <div class="patient-avatar">

      {{ patient?.name?.charAt(0) || "P" }}

    </div>

    <div class="patient-info">

      <strong>
        {{ patient?.name || "Unknown Patient" }}
      </strong>

      <span v-if="!compact">
        ID: #{{ patient?.id }}
      </span>

      <span v-else>
        {{ patient?.phone || "No phone" }}
      </span>

    </div>

  </div>

</template>

<script setup>

defineProps({

  patient: {
    type: Object,
    required: true
  },

  compact: {
    type: Boolean,
    default: false
  }

});

</script>