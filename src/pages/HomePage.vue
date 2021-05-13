<template>
  <Nav />
  <div class="container">
    <h1>Local Bird Tracker</h1>
    <div class="location-data">
      <div class="location-item">
        <div>Latitude:</div>
        <div>{{ lat.toFixed(4) }}</div>
      </div>
      <div class="location-item">
        <div>Longitude:</div>
        <div>{{ lon.toFixed(4) }}</div>
      </div>
      <div class="location-item">
        <div>Region code:</div>
        <div>{{ regionCode }}</div>
      </div>
    </div>
    <br />
    <div class="birds" v-if="birdsLoaded">
      <div
        class="bird-wrapper"
        v-for="birdName in birdsByName"
        :key="birdName"
        @click="onClickBird(birdName)"
      >
        <div class="bird">🐦 {{ birdName }}</div>
      </div>
    </div>
    <div v-else>Finding birds...</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Nav from "/src/components/Nav.vue";

const router = useRouter();
const store = useStore();

let lat = ref(0);
let lon = ref(0);
let regionCode = ref("");
let birdsByName = ref([]);
let allBirds = ref([]);
let birdsLoaded = ref(false);

const getLocation = async () => {
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  lat.value = position.coords.latitude;
  lon.value = position.coords.longitude;

  store.commit("setUserLocation", { lat: lat.value, lon: lon.value });
};

const getRegionCode = async () => {
  const response = await fetch(
    `https://geo.fcc.gov/api/census/area?lat=${lat.value}&lon=${lon.value}&format=json`
  );
  const json = await response.json();
  const data = json.results[0];
  const [, , fips2, fips3, fips4] = data.county_fips;

  regionCode.value = `US-${data.state_code}-${fips2}${fips3}${fips4}`;
};

const getBirds = async () => {
  const response = await fetch(
    `https://api.ebird.org/v2/data/obs/${regionCode.value}/recent/notable`,
    {
      headers: {
        "x-ebirdapitoken": "uq92puu4sujh",
      },
    }
  );
  const json = await response.json();

  allBirds.value = json;

  const species = json.map((sighting) => sighting.comName);
  birdsByName.value = [...new Set(species)].sort();
  birdsLoaded.value = true;
};

const onClickBird = (selectedBird) => {
  console.log(allBirds.value);
  const sightings = allBirds.value
    .filter((bird) => selectedBird === bird.comName)
    .sort((s1, s2) => {
      return new Date(s1.obsDt) - new Date(s2.obsDt);
    });

  console.log("found", sightings);

  const bird = {
    name: selectedBird,
    sightings,
  };

  store.commit("setBird", bird);

  router.push({ path: "/bird" });
};

onMounted(async () => {
  await getLocation();
  await getRegionCode();
  await getBirds();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: column;
  align-items: center;
}

.location-data {
  padding-bottom: 20px;
  width: 400px;
}

.location-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.location-item div:nth-child(1) {
  text-align: right;
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
  width: 80%;
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
