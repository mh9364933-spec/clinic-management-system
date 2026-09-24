<template>

  <div class="stat-card">

    <div class="stat-icon">

      <i
        class="bi"
        :class="icon"
      ></i>

    </div>

    <div class="stat-content">

      <span>
        {{ title }}
      </span>

      <h3>
        {{ value }}
      </h3>

      <small>
        {{ subtitle }}
      </small>

    </div>

  </div>

</template>

<script setup>

defineProps({

  title: String,

  value: {
    type: [String, Number],
    default: 0
  },

  icon: String,

  subtitle: String

});

</script>