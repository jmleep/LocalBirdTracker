import { ref } from 'vue'
import { shouldResendRequest } from '../api/util'
import { fetchRecentObservationsForType } from '../api/eBird'
import useLocation from './location'
import type { IActiveBird, IBird } from '../types/birds'

const activeBird = ref<IActiveBird>({ name: '', sightings: [] })
const isFetchingBirds = ref(false)
const activeBirdList = ref<IBird[]>([])
const activeBirdDisplayList = ref<string[]>([])
const allBirds = ref<IBird[]>([])
const allBirdsDisplayList = ref<string[]>([])
const notableBirds = ref<IBird[]>([])
const notableBirdsDisplayList = ref<string[]>([])
const timeSinceNotableBirdsRetrieved = ref<Date | undefined>()
const timeSinceAllBirdsRetrieved = ref<Date | undefined>()

const useBirds = () => {
  const { regionCode, getUserLocation } = useLocation()

  const sortBirdList = (by: string) => {
    switch (by) {
      case 'alphabetical':
        activeBirdDisplayList.value = activeBirdDisplayList.value.sort()
        break
      case 'newest':
        const sortedList = activeBirdList.value
          .sort((a: IBird, b: IBird) => new Date(a.obsDt).valueOf() - new Date(b.obsDt).valueOf())
          .map((bird: IBird) => bird.comName)

        activeBirdDisplayList.value = [...new Set(sortedList)]
        break
      default:
        break
    }
  }

  const setActiveBirdDisplayList = async (type: string, sort: string) => {
    isFetchingBirds.value = true
    if (!regionCode.value) {
      await getUserLocation()
    }

    if (type === 'notable') {
      await getNotableBirds()
      activeBirdList.value = notableBirds.value
      activeBirdDisplayList.value = notableBirdsDisplayList.value
      sortBirdList(sort)
    } else {
      await getAllBirds()
      activeBirdList.value = allBirds.value
      allBirdsDisplayList.value = allBirdsDisplayList.value
      sortBirdList(sort)
    }

    isFetchingBirds.value = false
  }

  const getNotableBirds = async () => {
    if (!notableBirds.value.length || shouldResendRequest(timeSinceNotableBirdsRetrieved.value)) {
      try {
        const json = await fetchRecentObservationsForType('notable', regionCode.value)

        const birdDisplayList: string[] = json.map((bird: IBird) => bird.comName)

        notableBirds.value = json
        notableBirdsDisplayList.value = [...new Set(birdDisplayList)]
        timeSinceNotableBirdsRetrieved.value = new Date()
      } catch (e) {
        isFetchingBirds.value = false
        console.error(e)
      }
    }
  }

  const getAllBirds = async () => {
    if (!allBirds.value.length || shouldResendRequest(timeSinceAllBirdsRetrieved.value)) {
      try {
        const json = await fetchRecentObservationsForType('', regionCode.value)
        console.log(json)
        const birdDisplayList: string[] = json.map((bird: IBird) => bird.comName)

        allBirds.value = json
        allBirdsDisplayList.value = [...new Set(birdDisplayList)]
        timeSinceAllBirdsRetrieved.value = new Date()
      } catch (e) {
        isFetchingBirds.value = false
        console.error(e)
      }
    }
  }

  const setActiveBird = (index: number) => {
    const selectedBird = activeBirdDisplayList.value[index]
    const sightings = activeBirdList.value
      .filter((bird: IBird) => selectedBird === bird.comName)
      .sort((s1, s2) => {
        return new Date(s2.obsDt).valueOf() - new Date(s1.obsDt).valueOf()
      })

    activeBird.value = {
      name: selectedBird,
      sightings
    }
  }

  return {
    activeBird,
    setActiveBird,
    isFetchingBirds,
    activeBirdList,
    activeBirdDisplayList,
    setActiveBirdDisplayList,
    sortBirdList
  }
}

export default useBirds
