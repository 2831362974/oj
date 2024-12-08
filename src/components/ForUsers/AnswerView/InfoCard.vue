<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description1: {
    type: String,
    default: "",
  },
  description2: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="card" style="height: 165px;overflow:auto;">
    <div class="p-3 mx-4 text-center card-header d-flex justify-content-center">
      <h5 class="mt-0 text-center">{{ title }}</h5>
    </div>
    <div class="p-3 pt-0 card-body">
      <p class="px-1 mt-2"><span class="text-start text-xl"><slot name="text1"/>{{ description1 }}</span></p>
      <p class="px-1 mt-1"><span class="text-center text-xl"><slot name="text2"/>{{ description2 }}</span></p>
    </div>
  </div>
</template>
