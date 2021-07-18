<template>
  <div class="container">
    <div v-if="bird">
      <div class="header">
        <router-link to="/" tag="button"> ‹ </router-link>
        <h1>
          <div class="title" @click="openGoogleForBird()">
            {{ bird.name }}
          </div>
        </h1>
        <span class="link">🔗</span>
        <div>{{ bird.sightings.length }} sighting(s)</div>
      </div>
      <div :style="cssVars" class="content">
        <div class="sightings">
          <div
            v-for="(sighting, index) in bird.sightings"
            :key="sighting"
            :ref="setSightingRefs"
            :class="
              index === selectedSighting
                ? 'sighting-row selected'
                : 'sighting-row'
            "
            @click="onClickSighting(index)"
          >
            <div class="sighting-sub-row">
              <div class="icon">📅</div>
              <div>{{ sighting.obsDt }}</div>
            </div>
            <div class="sighting-sub-row">
              <div class="icon">📍</div>
              <div>{{ sighting.locName }}</div>
            </div>

            <div>Latitude: {{ sighting.lat }}</div>
            <div>Longitude: {{ sighting.lng }}</div>
          </div>
        </div>
        <Map
          v-model:selectedSighting="selectedSighting"
          :sightings="bird.sightings"
          :sighting-refs="sightingRefs"
          :css-vars="cssVars"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Map from "/src/components/Map.vue";

export default {
  components: {
    Map,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const bird = computed(() => store.state.birds.activeBird);
    const selectedSighting = ref(null);
    const sightingRefs = ref([]);

    if (!bird.value.sightings.length) {
      router.push({ path: "/" });
    }

    const setSightingRefs = (el) => {
      if (el) {
        sightingRefs.value.push(el);
      }
    };

    onMounted(() => {
      window.scrollTo(0, 0);
    });

    const openGoogleForBird = () => {};

    const onClickSighting = (index) => {
      selectedSighting.value = index;
    };

    let height = window.innerHeight - 215;
    if (height <= 100) {
      height = window.innerHeight;
    }

    const cssVars = {
      "--height": `${height}px`,
    };

    return {
      bird,
      cssVars,
      selectedSighting,
      openGoogleForBird,
      onClickSighting,
      sightingRefs,
      setSightingRefs,
    };
  },
};
</script>

<style scoped>
@media screen and (min-width: 800px) {
  .content {
    display: grid;
    grid-template-columns: 25% 75%;
    height: var(--height);
  }
}

@media screen and (max-width: 799px) {
  .content {
    display: grid;
    grid-template-columns: 1fr;
    height: var(--height);
  }

  .sightings {
    display: none;
  }
}

.container {
  overflow-y: hidden;
  height: 100%;
  width: 100vw;
  padding-left: 50px;
}

.header {
  display: flex;
  align-items: center;
  margin: 0px 20px 20px 20px;
}

.header a:first-of-type {
  text-decoration: none;
  padding: 0px 25px 8px 10px;
  font-size: 3em;
  color: #567eaf;
}

.header a:first-of-type:hover {
  cursor: pointer;
  color: #3b597d;
  text-decoration: underline;
}

.title {
  margin: 0px;
  color: #567eaf;
  padding-right: 5px;
}

.title:hover {
  text-decoration: underline;
  cursor: pointer;
  color: #3b597d;
}

.link {
  font-size: 0.8em;
  padding-right: 15px;
}

.icon {
  padding-right: 8px;
}

.sightings {
  overflow-y: scroll;
  height: var(--height);
  padding: 0px 10px 10px 0px;
}

.sighting-row {
  padding: 10px;
  border-top: 1px solid #3b597d;
  cursor: pointer;
}

.selected {
  background-color: #567eaf;
  color: white;
  cursor: auto;
}

.sighting-sub-row {
  display: flex;
  padding-bottom: 15px;
}
</style>