<script setup>
import Carousel from "@/components/HomeView/Carousel.vue";
</script>

<template>
  <div class="py-5 container-fluid">
    <div class="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative card">
      <div class="pl-4 pr-0 h-100 tofront">
        <div class="row justify-content-between ">
          <div class="col-md-6 pt-6 pb-6 align-self-center rounded-start">
            <h1 class="secondfont m-3 font-weight-bold">欢迎来到MyOJ</h1>
            <p class="m-3">
              欢迎来到我们的在线评测平台，这是一个专为编程爱好者与学习者打造的智慧编程天地。无论你是初涉编程领域的新手，渴望在代码的海洋中踏出坚实的第一步；还是经验丰富的编程高手，寻求新的挑战与突破，本平台都将是你的理想之选。
            </p>
            <p class="m-3">
              如果你有好的意见，可以向我们提出以打造更好的在线评测平台。
            </p>
            <a href="./question" class="m-4 btn btn-success">马上开始</a>
          </div>
          <div class="col-md-6 d-none d-md-block pr-0 rounded-end" style="background-size:cover;background-image:url(/src/assets/img/carousel-3.jpg);">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
