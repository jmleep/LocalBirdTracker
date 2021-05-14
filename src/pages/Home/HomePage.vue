<template>
  <Nav />
  <div class="container">
    <h1 class="header">Local Bird Tracker</h1>

    <div class="data">
      <Location />

      <div class="section">
        <div class="section-title">Birds</div>
        <div class="section-content">
          <label>
            <input type="radio" value="notable" v-model="activeBirdListType" />
            Notable
          </label>
          <label>
            <input type="radio" value="all" v-model="activeBirdListType" />All
          </label>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Sort</div>
        <div class="section-content">
          <label>
            <input type="radio" value="newest" v-model="activeSort" />
            Newest
          </label>
          <label>
            <input
              type="radio"
              value="alphabetical"
              v-model="activeSort"
            />Alphabetical
          </label>
        </div>
      </div>
    </div>

    <div class="birds" v-if="!isFetchingBirds">
      <div
        class="bird-wrapper"
        v-for="(bird, index) in activeBirdList"
        :key="bird"
        @click="onClickBird(index)"
      >
        <div class="bird">🐦 {{ bird }}</div>
      </div>
    </div>
    <div v-else>Finding birds...</div>
  </div>
</template>

<script>
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Nav from "/src/components/Nav.vue";
import Location from "/src/pages/Home/Location.vue";

export default {
  components: {
    Nav,
    Location,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const activeSort = ref("newest");
    const activeBirdListType = ref("notable");
    const activeBirdList = computed(
      () => store.state.birds.activeBirdDisplayList
    );

    watch(activeBirdListType, async (value) => {
      store.dispatch("birds/setActiveBirdDisplayList", {
        type: value,
        sort: activeSort.value,
      });
    });

    watch(activeSort, async (value) => {
      console.log(value);
      store.commit("birds/sortBirdList", value);
    });

    const onClickBird = (index) => {
      store.commit("birds/setActiveBird", index);
      router.push({ path: "/bird" });
    };

    onMounted(async () => {
      store.dispatch("birds/setActiveBirdDisplayList", {
        type: activeBirdListType.value,
        sort: activeSort.value,
      });
    });

    return {
      isFetchingBirds: computed(() => store.state.birds.isFetchingBirds),
      onClickBird,
      activeBirdList,
      activeBirdListType,
      activeSort,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: column;
  margin: 0px 100px;
}

.header {
  text-align: center;
  margin: 20px 0px;
}

.data {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  padding: 20px 0px;
}

.section {
  display: flex;
  flex-flow: column;
  margin: 0px auto;
}

.section-content {
  display: flex;
  flex-flow: column;
}

.section-title {
  font-weight: 800;
}

.birds {
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: left;
}

.bird-wrapper {
  border: 1px solid #3b597d;
  margin: 5px;
  width: 100%;
}

.bird {
  padding: 15px;
}

.bird :first-child {
  text-align: right;
}

.bird :last-child {
  text-align: left;
}

.bird-wrapper :hover {
  background-color: #567eaf;
  color: #fff;
  cursor: pointer;
}
</style>
