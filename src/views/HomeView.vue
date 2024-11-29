<script setup>
/*考虑去除该页面*/
import Carousel from "../components/HomeView/Carousel.vue";
import CategoriesList from "@/components/HomeView/CategoriesList.vue";
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="col-lg-5">
          <carousel/>
        </div>
        <div class="col-lg-7">
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-lg-7 mb-lg-0 mb-4">

        </div>
        <div class="col-lg-5">
          <categories-list
              :title="'平台数据'"
              :categories="[
                {
                  icon: {component: 'ni ni-mobile-button',background: 'dark'},
                  label: '题目',
                  description: '已收录 <strong>346+ 题目</strong>',
                },
                {
                  icon:{component: 'ni ni-tag',background: 'dark',},
                  label: '用户',
                  description: '注册人数 <strong>15 人</strong>',
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: '提交',
                  description: '今日已经提交 <strong>40 次</strong>',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: '今日已做题用户',
                  description: '430人',
                },
              ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
