import { ref } from 'vue'
import { shouldResendRequest } from '../api/util'

const userLat = ref(0)
const userLon = ref(0)
const isLocationAllowed = ref(true)
const regionCode = ref<string>()
const timeRegionCodeLastRetrieved = ref<Date | undefined>()

const useLocation = () => {
  const getUserLocation = async () => {
    let position: GeolocationPosition
    try {
      position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      if (position) {
        userLat.value = position?.coords?.latitude
        userLon.value = position?.coords?.longitude
        await getRegionCode()
      }
    } catch (err) {
      console.log(err)
      isLocationAllowed.value = false
    }
  }

  const getRegionCode = async () => {
    if (!regionCode.value || shouldResendRequest(timeRegionCodeLastRetrieved.value)) {
      const response = await fetch(
        `https://geo.fcc.gov/api/census/area?lat=${userLat.value}&lon=${userLon.value}&format=json`
      )
      const json = await response.json()
      const data = json.results[0]
      const [, , fips2, fips3, fips4] = data.county_fips

      regionCode.value = `US-${data.state_code}-${fips2}${fips3}${fips4}`
      timeRegionCodeLastRetrieved.value = new Date()
    }
  }

  return {
    userLat,
    userLon,
    regionCode,
    isLocationAllowed,
    timeRegionCodeLastRetrieved,
    getUserLocation
  }
}

export default useLocation
