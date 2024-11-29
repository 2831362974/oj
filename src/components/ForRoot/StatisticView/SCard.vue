<script setup>
//todo 卡片模板
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
  <div class="card" style="height: 160px">
    <div class="p-3 mx-4 text-center card-header d-flex justify-content-center">

    </div>
    <div class="p-3 pt-0 card-body">
      <h6 class="mt-0 text-center">{{ title }}</h6>
      <p class="px-1 mt-2"><span class="text-start text-xs"><slot name="text1"/>{{ description1 }}</span></p>
      <p class="px-1 mt-1"><span class="text-start text-xs"><slot name="text2"/>{{ description2 }}</span></p>
    </div>
  </div>
</template>
