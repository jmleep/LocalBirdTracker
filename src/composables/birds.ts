import { ref, watch } from 'vue'
import { shouldResendRequest } from '../api/util'
import { fetchRecentObservationsForType } from '../api/eBird'
import useLocation from './location'
import type { IActiveBird, IBird } from '../types/birds'
import { BirdSelection, Sort } from '../types/ui'

const activeBird = ref<IActiveBird>({ name: '', sightings: [] })
const isFetchingBirds = ref(false)

const notableBirdList = ref<IBird[]>([])
const timeSinceNotableBirdsRetrieved = ref<Date | undefined>()

const allBirdList = ref<IBird[]>([])
const timeSinceAllBirdsRetrieved = ref<Date | undefined>()

const birdNameList = ref<string[]>([])
const birdList = ref<IBird[]>([])

const sort = ref<Sort>(Sort.Newest)
const birdSelection = ref<BirdSelection>(BirdSelection.Notable)

const useBirds = () => {
  const { regionCode, getUserLocation } = useLocation()

  watch(sort, (newValue) => {
    sortBirdNameList(newValue)
  })

  watch(birdSelection, () => {
    fetchBirds()
  })

  const sortBirdNameList = (by: Sort) => {
    switch (by) {
      case Sort.Alphabetical:
        birdNameList.value = birdNameList.value.sort()

        break
      case Sort.Newest:
        const sortedList = birdList.value
          .sort((a: IBird, b: IBird) => new Date(a.obsDt).valueOf() - new Date(b.obsDt).valueOf())
          .map((bird: IBird) => bird.comName)

        birdNameList.value = [...new Set(sortedList)]
        break
      default:
        break
    }
  }

  const fetchBirds = async () => {
    isFetchingBirds.value = true
    if (!regionCode.value) {
      await getUserLocation()
    }

    let fetchedBirds: IBird[]
    if (birdSelection.value === BirdSelection.Notable) {
      fetchedBirds = await getNotableBirds()
    } else {
      fetchedBirds = await getAllBirds()
    }

    birdList.value = fetchedBirds
    birdNameList.value = [...new Set(fetchedBirds.map((bird: IBird) => bird.comName))]

    sortBirdNameList(sort.value)

    isFetchingBirds.value = false
  }

  const getNotableBirds = async (): Promise<IBird[]> => {
    if (
      !notableBirdList.value.length ||
      shouldResendRequest(timeSinceNotableBirdsRetrieved.value)
    ) {
      try {
        const json = await fetchRecentObservationsForType('notable', regionCode.value)
        timeSinceNotableBirdsRetrieved.value = new Date()
        notableBirdList.value = json
      } catch (e) {
        isFetchingBirds.value = false
        console.error(e)
      }
    }
    return notableBirdList.value
  }

  const getAllBirds = async (): Promise<IBird[]> => {
    if (!allBirdList.value.length || shouldResendRequest(timeSinceAllBirdsRetrieved.value)) {
      try {
        const json = await fetchRecentObservationsForType('', regionCode.value)
        timeSinceAllBirdsRetrieved.value = new Date()
        allBirdList.value = json
      } catch (e) {
        isFetchingBirds.value = false
        console.error(e)
      }
    }
    return allBirdList.value
  }

  const setActiveBird = (selectedBirdIndex: number) => {
    const selectedBirdName = birdNameList.value[selectedBirdIndex]

    const sightings = birdList.value
      .filter((bird: IBird) => selectedBirdName === bird.comName)
      .sort((s1, s2) => {
        return new Date(s2.obsDt).valueOf() - new Date(s1.obsDt).valueOf()
      })

    activeBird.value = {
      name: selectedBirdName,
      sightings
    }
  }

  return {
    activeBird,
    setActiveBird,
    isFetchingBirds,
    birdNameList,
    sort,
    birdSelection,
    fetchBirds
  }
}

export default useBirds
