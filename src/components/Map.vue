<template>
  <div id="map" :style="cssVars" class="map"></div>
</template>

<script setup>
import { onMounted, watch, computed, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const props = defineProps({
  sightings: {
    type: Array,
    required: true,
  },
  sightingRefs: {
    type: Array,
    required: true,
  },
  selectedSighting: {
    type: Number,
    required: true,
  },
  cssVars: {
    type: Object,
    required: true,
  },
});
const emit = defineEmit();

const { sightings, sightingRefs, selectedSighting, cssVars } = toRefs(props);
const store = useStore();
const router = useRouter();

if (!sightings.value.length) {
  router.push({ path: "/" });
}

const lat = computed(() => store.state.location.userLat);
const lon = computed(() => store.state.location.userLon);

const view = new ol.View({
  center: ol.proj.fromLonLat([lon.value, lat.value]),
  zoom: 12,
});

const pins = sightings.value.map((sighting, index) => {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat([sighting.lng, sighting.lat])
    ),
  });
  feature.set("index", index);
  return feature;
});

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

let map;

onMounted(() => {
  try {
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

        emit("update:selectedSighting", index);
        sightingRefs.value[index].scrollIntoView();
      });
    });
  } catch (e) {
    router.push({ path: "/" });
  }
});

watch(selectedSighting, () => {
  const point = pins[selectedSighting.value].getGeometry();
  const size = map.getSize();
  view.centerOn(point.getCoordinates(), size, [size[0] / 2, size[1] / 2]);
});
</script>

<style>
.map {
  display: grid;
  grid-template-columns: 1fr 100px;
  height: var(--height);
}
</style>