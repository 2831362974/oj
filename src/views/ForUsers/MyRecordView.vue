<script setup>
//todo  1.收藏的题目 2.通过的题目
import {computed, onMounted, ref} from 'vue';
import {useStore} from "vuex";
import {useRouter} from 'vue-router';
import {fetchFavoriteProblems, fetchPassedProblems} from "@/api/api.js";

const store = useStore();
const userStars = ref([]);
const userPassedProblems = ref([]);
const username = computed(() => store.state.username);

const fetchData = async () => {
  try {
    const response = await fetchFavoriteProblems();
    userStars.value = response.data;
    if (username.value) {
      // 获取已通过题目数据
      const responsePassed = await fetchPassedProblems(username.value);
      userPassedProblems.value = responsePassed.data;}
  } catch (error) {
    console.error('获取我的题目数据失败', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-6">
        <div class="card" style="height:500px;overflow: auto">
          <div class="card-header pb-0">
            <h6>我的收藏</h6>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <!--            表头的内容由数据库设计决定-->
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">id</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">title</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Difficulty</th>
                  <th class="text-center text-secondary text-xxs font-weight-bolder opacity-7">star</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in userStars" :key="item.id">
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ item.id }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ item.title }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span :class="['badge badge-sm', getDifficultyBadge(item.difficulty)]">{{ item.difficulty }}</span>
                  </td>
                  <td class="align-middle text-center">
                    <i v-if="!item.isFavorited" class="far fa-star" @click="handleFavoriteQuestion(item.id)"></i>
                    <i v-else class="fas fa-star" @click="handleUnFavoriteQuestion(item.id)"></i>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card" style="height:500px;overflow: auto">
          <div class="card-header pb-0">
            <h6>已经通过</h6>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <!--            表头的内容由数据库设计决定-->
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">id</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">title</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Difficulty</th>
                  <th class="text-center text-secondary text-xxs font-weight-bolder opacity-7">star</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in userStars" :key="item.id">
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ item.id }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ item.title }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span :class="['badge badge-sm', getDifficultyBadge(item.difficulty)]">{{ item.difficulty }}</span>
                  </td>
                  <td class="align-middle text-center">
                    <i v-if="!item.isFavorited" class="far fa-star" @click="handleFavoriteQuestion(item.id)"></i>
                    <i v-else class="fas fa-star" @click="handleUnFavoriteQuestion(item.id)"></i>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>