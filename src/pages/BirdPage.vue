<template>
  <div class="container">
    <Nav />
    <div v-if="bird">
      <div class="header">
        <router-link to="/" tag="button">‹</router-link>
        <h1>
          <div @click="openGoogleForBird()">{{ bird.name }}</div>
        </h1>
        <div>{{ bird.sightings.length }} sighting(s)</div>
      </div>
      <div :style="cssVars" class="content">
        <div class="sightings">
          <div
            v-for="sighting in bird.sightings"
            :key="sighting"
            class="sighting-row"
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
        <div>
          <div :style="cssVars" id="map" class="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Nav from "/src/components/Nav.vue";

export default {
  components: {
    Nav,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const bird = computed(() => store.state.birds.activeBird);
    const lat = computed(() => store.state.location.userLat);
    const lon = computed(() => store.state.location.userLon);

    if (!bird.value.sightings.length) {
      router.push({ path: "/" });
    }

    onMounted(() => {
      try {
        window.scrollTo(0, 0);

        const style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: [255, 0, 0] }),
            stroke: new ol.style.Stroke({
              color: [255, 255, 255],
              width: 2,
            }),
          }),
        });

        const pins = bird.value.sightings.map(
          (sighting) =>
            new ol.Feature({
              geometry: new ol.geom.Point(
                ol.proj.fromLonLat([sighting.lng, sighting.lat])
              ),
            })
        );

        const pinsLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: pins,
          }),
          style,
        });

        const map = new ol.Map({
          target: "map",
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM(),
            }),
            pinsLayer,
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([lon.value, lat.value]),
            zoom: 12,
          }),
        });
      } catch (e) {
        router.push({ path: "/" });
      }
    });

    let height = window.innerHeight - 125;
    if (height <= 100) {
      height = window.innerHeight;
    }

    const cssVars = {
      "--height": `${height}px`,
    };

    const openGoogleForBird = () => {
      window.open(
        `https://www.google.com/search?q=${bird.value.name}`,
        "_target"
      );
    };

    return {
      bird,
      cssVars,
      openGoogleForBird,
    };
  },
};
</script>

<style scoped>
.container {
  overflow-y: hidden;
  height: 100%;
  width: 100vw;
}

.header {
  display: flex;
  align-items: center;
  margin: 0px 20px 20px 20px;
}

.header h1 {
  margin: 0px;
  padding-right: 15px;
}

.header h1 div {
  text-decoration: underline;
  cursor: pointer;
}

.header a:first-of-type {
  text-decoration: none;
  padding: 0px 10px 6px 10px;
  font-size: 2.5em;
}

.icon {
  padding-right: 8px;
}

.sightings {
  overflow-y: scroll;
  height: var(--height);
}

.sightings :first-child {
  margin-top: 0px;
}

.sighting-row {
  margin: 20px;
  padding-top: 20px;
  border-top: 1px solid #3b597d;
}

.sighting-sub-row {
  display: flex;
  padding-bottom: 15px;
}

.map {
  height: var(--height);
  width: 100%;
}

.content {
  display: grid;
  grid-template-columns: 25% 75%;
}
</style>