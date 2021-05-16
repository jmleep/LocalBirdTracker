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
        <div>
          <div :style="cssVars" id="map" class="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref, onBeforeUpdate, watch } from "vue";
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

    const selectedSighting = ref(null);

    if (!bird.value.sightings.length) {
      router.push({ path: "/" });
    }

    const view = new ol.View({
      center: ol.proj.fromLonLat([lon.value, lat.value]),
      zoom: 12,
    });

    const pins = bird.value.sightings.map((sighting, index) => {
      const feature = new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.fromLonLat([sighting.lng, sighting.lat])
        ),
      });
      feature.set("index", index);
      return feature;
    });

    let map;

    let sightingRefs = ref([]);
    // make sure to reset the refs before each update
    onBeforeUpdate(() => {
      sightingRefs.value = [];
    });
    const setSightingRefs = (el) => {
      if (el) {
        sightingRefs.value.push(el);
      }
    };

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

        const pinsLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: pins,
          }),
          style,
        });

        map = new ol.Map({
          target: "map",
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM(),
            }),
            pinsLayer,
          ],
          view,
        });

        view.setCenter(pins[0].getGeometry().getCoordinates());

        map.on("click", (e) => {
          map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
            const index = feature.get("index");
            selectedSighting.value = index;

            sightingRefs.value[index].scrollIntoView();
          });
        });
      } catch (e) {
        router.push({ path: "/" });
      }
    });

    let height = window.innerHeight - 150;
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

    const onClickSighting = (index) => {
      selectedSighting.value = index;

      const point = pins[index].getGeometry();
      const size = map.getSize();
      view.centerOn(point.getCoordinates(), size, [size[0] / 2, size[1] / 2]);
    };

    return {
      bird,
      selectedSighting,
      cssVars,
      openGoogleForBird,
      onClickSighting,
      sightingRefs,
      setSightingRefs,
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
  padding: 10px;
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

.map {
  height: var(--height);
  width: 100%;
}

.content {
  display: grid;
  grid-template-columns: 25% 75%;
}
</style>