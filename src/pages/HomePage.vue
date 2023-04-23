<template>
  <div class="container">
    <h1 class="header">Local Bird Tracker</h1>
    <div class="data">
      <Location />
      <div class="data-list-preferences">
        <div class="section">
          <div class="section-title">Birds</div>
          <RadioButtonGroup v-model="birdListType" :items="birdListItems" />
        </div>
        <div class="section">
          <div class="section-title">Sort</div>
          <RadioButtonGroup v-model="sort" :items="sortItems" />
        </div>
      </div>
    </div>
    <EBirdInfo />
    <div v-if="!isFetchingBirds" class="birds">
      <div
        v-for="(bird, index) in activeBirdDisplayList"
        :key="bird"
        class="bird-wrapper"
        @click="onClickBird(index)"
      >
        <div class="bird">🐦 {{ bird }}</div>
      </div>
    </div>
    <div v-else class="loading">Finding birds...</div>
    <div v-if="!isLocationAllowed">
      <Error message="Please refresh and allow location access in order to use the site." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useBird from '../composables/birds'
import Location from '../components/Location.vue'
import RadioButtonGroup from '../components/ui/RadioButtonGroup.vue'
import Error from '../components/Error.vue'
import EBirdInfo from '../components/EBirdInfo.vue'
import useLocation from '../composables/location'

const router = useRouter()

const {
  activeBirdDisplayList,
  isFetchingBirds,
  setActiveBirdDisplayList,
  setActiveBird,
  sortBirdList
} = useBird()
const { isLocationAllowed } = useLocation()

const birdListType = ref('notable')
const birdListItems = [
  { label: 'Notable', value: 'notable' },
  { label: 'All', value: 'all' }
]

const sort = ref('newest')
const sortItems = [
  { label: 'Newest', value: 'newest' },
  { label: 'Alphabetical', value: 'alphabetical' }
]

watch(birdListType, async (value) => {
  setActiveBirdDisplayList(value, sort.value)
})

watch(sort, async (value) => {
  sortBirdList(value)
})

const onClickBird = (index: number) => {
  setActiveBird(index)
  router.push({ path: '/bird' })
}

onMounted(async () => {
  setActiveBirdDisplayList(birdListType.value, sort.value)
})
</script>

<style scoped>
@media screen and (max-width: 799px) {
  .container {
    display: flex;
    flex-flow: column;
    margin: 0px 50px;
  }
  .data {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    justify-content: start;
    padding: 20px 0px;
  }

  .data .section {
    margin: 0px;
  }

  .data-list-preferences {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (max-width: 500px) {
  .container {
    display: flex;
    flex-flow: column;
    margin: 0px 10px;
  }

  .data {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    justify-content: start;
    padding: 20px 0px;
  }

  .data .section {
    margin: 0px;
  }

  .data-list-preferences {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (min-width: 800px) {
  .container {
    display: flex;
    flex-flow: column;
    margin: 0px 100px;
  }

  .data {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
  }

  .data div {
    align-self: start;
    padding-right: 20px;
  }

  .data-list-preferences {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.header {
  text-align: center;
  margin: 20px 0px;
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
  align-self: start;
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

.loading {
  text-align: center;
  padding: 50px;
}
</style>
