<template>
  <Nav />
  <div class="container">
    <h1 class="header">Local Bird Tracker</h1>

    <div class="data">
      <Location />

      <div class="section">
        <div class="section-title">Birds</div>
        <RadioButtonGroup v-model="birdListType" :items="birdListItems" />
      </div>
      <div class="section">
        <div class="section-title">Sort</div>
        <RadioButtonGroup v-model="sort" :items="sortItems" />
      </div>
    </div>

    <div class="birds" v-if="!isFetchingBirds">
      <div
        class="bird-wrapper"
        v-for="(bird, index) in birdDisplayList"
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
import Location from "/src/components/Location.vue";
import RadioButtonGroup from "/src/components/ui/RadioButtonGroup.vue";

export default {
  components: {
    Nav,
    Location,
    RadioButtonGroup,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const birdDisplayList = computed(
      () => store.state.birds.activeBirdDisplayList
    );

    const birdListType = ref("notable");
    const birdListItems = [
      { label: "Notable", value: "notable" },
      { label: "All", value: "all" },
    ];

    const sort = ref("newest");
    const sortItems = [
      { label: "Newest", value: "newest" },
      { label: "Alphabetical", value: "alphabetical" },
    ];

    watch(birdListType, async (value) => {
      store.dispatch("birds/setActiveBirdDisplayList", {
        type: value,
        sort: sort.value,
      });
    });

    watch(sort, async (value) => {
      store.commit("birds/sortBirdList", value);
    });

    const onClickBird = (index) => {
      store.commit("birds/setActiveBird", index);
      router.push({ path: "/bird" });
    };

    onMounted(async () => {
      store.dispatch("birds/setActiveBirdDisplayList", {
        type: birdListType.value,
        sort: sort.value,
      });
    });

    return {
      isFetchingBirds: computed(() => store.state.birds.isFetchingBirds),
      onClickBird,
      birdDisplayList,
      birdListType,
      birdListItems,
      sort,
      sortItems,
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

.data span {
  height: 25px;
  width: 25px;
  background-color: #3b597d;
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

.radio input[type="radio"] {
  display: none;
  /*removes original button*/
}

.radio label:before {
  /*styles outer circle*/
  content: " ";
  display: inline-block;
  position: relative;
  top: 5px;
  margin: 0 5px 0 0;
  width: 16px;
  height: 16px;
  border-radius: 11px;
  border: 2px solid #3b597d;
  background-color: transparent;
}

.radio label {
  position: relative;
}

.radio label input[type="radio"]:checked + span {
  /*styles inside circle*/
  border-radius: 11px;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 9px;
  left: 4px;
  display: block;
  background-color: #567eaf;
}
</style>
