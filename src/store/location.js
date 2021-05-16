import { shouldResendRequest } from '/src/api/util';

const location = {
    namespaced: true,
    state: {
        userLat: 0,
        userLon: 0,
        isLocationAllowed: true,
        regionCode: undefined,
        timeRegionCodeLastRetrieved: undefined
    },
    getters: {
        getRegionCode(state) {
            return state.regionCode;
        }
    },
    mutations: {
        setUserLocation(state, { lat, lon }) {
            state.userLat = lat;
            state.userLon = lon;
        },
        setIsLocationAllowed(state, isLocationAllowed) {
            console.log(state)
            state.isLocationAllowed = isLocationAllowed;
        },
        setRegionCode(state, regionCode) {
            state.regionCode = regionCode;
        },
        setTimeRegionCodeLastRetrieved(state, time) {
            state.timeRegionCodeLastRetrieved = time;
        }
    },
    actions: {
        async getUserLocation({ commit }) {
            let position;
            try {
                position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition((resolve), reject);
                });
            } catch (err) {
                console.log(err)
                commit('setIsLocationAllowed', false);
            }

            console.log(position)
            if (position) {
                commit(
                    "setUserLocation",
                    {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    }
                );
            }
        },
        async getRegionCode({ commit, state }) {
            if (!state.regionCode || shouldResendRequest(state.timeRegionCodeLastRetrieved)) {
                const response = await fetch(
                    `https://geo.fcc.gov/api/census/area?lat=${state.userLat}&lon=${state.userLon}&format=json`
                );
                const json = await response.json();
                const data = json.results[0];
                const [, , fips2, fips3, fips4] = data.county_fips;

                commit('setRegionCode', `US-${data.state_code}-${fips2}${fips3}${fips4}`);
                commit('setTimeRegionCodeLastRetrieved', new Date());
            }
        }
    }
};

export default location;
