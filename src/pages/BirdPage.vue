<template>
  <div class="container">
    <Nav />
    <div v-if="bird">
      <h1 class="title">{{ bird.name }}</h1>
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
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Nav from "/src/components/Nav.vue";

export default {
  components: {
    Nav,
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();

    const bird = store.getters.getBird;
    const { lat, lon } = store.getters.getUserLocation;

    console.log(bird);

    if (!bird) {
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

        const pins = bird.sightings.map(
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
            center: ol.proj.fromLonLat([lon, lat]),
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

    return {
      bird,
      cssVars,
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

.title {
  margin: 0px 20px 20px 20px;
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