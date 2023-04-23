<template>
  <div id="map" :style="cssVars" class="map"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import useLocation from '../composables/location'
import type { IBird } from '../types/birds'
import View from 'ol/View'
import Map from 'ol/Map'
import Feature from 'ol/Feature'
import { fromLonLat } from 'ol/proj'
import { Point } from 'ol/geom'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import { Vector, Tile } from 'ol/layer'
import { Vector as SourceVector, OSM } from 'ol/source'

const { userLat, userLon } = useLocation()

const props = defineProps<{
  sightings: IBird[]
  sightingRefs: HTMLDivElement[]
  selectedSighting: number
  cssVars: {}
}>()
const emit = defineEmits<{ (event: 'update:selectedSighting', value: number): void }>()

const { sightings, sightingRefs, selectedSighting, cssVars } = toRefs(props)
const router = useRouter()

if (!sightings.value.length) {
  router.push({ path: '/' })
}

const view = new View({
  center: fromLonLat([userLon.value, userLat.value]),
  zoom: 12
})

const pins = sightings.value.map((sighting, index) => {
  const feature = new Feature({
    geometry: new Point(fromLonLat([sighting.lng, sighting.lat]))
  })
  feature.set('index', index)
  return feature
})

const mapStyle = new Style({
  image: new Circle({
    radius: 7,
    fill: new Fill({ color: [255, 0, 0] }),
    stroke: new Stroke({
      color: [255, 255, 255],
      width: 2
    })
  })
})

let map = new Map()

onMounted(() => {
  try {
    const pinsLayer = new Vector({
      source: new SourceVector({
        features: pins
      }),
      style: mapStyle
    })

    map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        }),
        pinsLayer
      ],
      view
    })

    const firstPinGeometry = pins[0]?.getGeometry()?.getCoordinates()
    if (firstPinGeometry) {
      view.setCenter(firstPinGeometry)
    }

    map.on('click', (e) => {
      map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        const index = feature.get('index')

        emit('update:selectedSighting', index)
        sightingRefs.value[index].scrollIntoView()
      })
    })
  } catch (e) {
    router.push({ path: '/' })
  }
})

watch(selectedSighting, () => {
  const point = pins[selectedSighting.value].getGeometry()
  const size = map.getSize()

  if (point && size) {
    view.centerOn(point.getCoordinates(), size, [size[0] / 2, size[1] / 2])
  }
})
</script>

<style>
.map {
  display: grid;
  grid-template-columns: 1fr 100px;
  height: var(--height);
}
</style>
