import { shouldResendRequest } from '../api/util';
import { fetchRecentObservationsForType } from '../api/eBird';

const state = {
    activeBird: {
        name: undefined,
        sightings: []
    },
    isFetchingBirds: false,
    activeBirdList: [],
    activeBirdDisplayList: [],
    allBirds: [],
    allBirdsDisplayList: [],
    notableBirds: [],
    notableBirdsDisplayList: [],
    timeSinceNotableBirdsRetrieved: undefined,
    timeSinceAllBirdsRetrieved: undefined
}

const mutations = {
    setActiveBird(state, index) {
        const selectedBird = state.activeBirdDisplayList[index];
        const sightings = state.activeBirdList
            .filter((bird) => selectedBird === bird.comName)
            .sort((s1, s2) => {
                return new Date(s2.obsDt) - new Date(s1.obsDt);
            });

        state.activeBird = {
            name: selectedBird,
            sightings
        }
    },
    setIsFetchingBirds(state, isFetchingBirds) {
        state.isFetchingBirds = isFetchingBirds;
    },
    setActiveBirdList(state, list) {
        state.activeBirdList = list;
    },
    setActiveBirdDisplayList(state, list) {
        state.activeBirdDisplayList = list;
    },
    setAllBirds(state, notableBirds) {
        state.allBirds = notableBirds;
    },
    setAllBirdsDisplayList(state, displayList) {
        state.allBirdsDisplayList = displayList;
    },
    setNotableBirds(state, notableBirds) {
        state.notableBirds = notableBirds;
    },
    setNotableBirdsDisplayList(state, displayList) {
        state.notableBirdsDisplayList = displayList;
    },
    sortBirdList(state, by) {
        switch (by) {
            case 'alphabetical':
                state.activeBirdDisplayList = state.activeBirdDisplayList.sort();
                break;
            case 'newest':
                const sortedList = state.activeBirdList
                    .sort((a, b) => new Date(a.obsDt) - new Date(b.obsDt))
                    .map(bird => bird.comName);

                state.activeBirdDisplayList = [...new Set(sortedList)];
                break;
            default:
                break;
        }
    },
    setTimeSinceNotableBirdsRetrieved(state, time) {
        state.timeSinceNotableBirdsRetrieved = time;
    },
    setTimeSinceAllBirdsRetrieved(state, time) {
        state.timeSinceAllBirdsRetrieved = time;
    }
}

const actions = {
    async setActiveBirdDisplayList({ state, commit, dispatch }, { type, sort }) {
        if (type === 'notable') {
            await dispatch('getNotableBirds');
            commit('setActiveBirdList', state.notableBirds);
            commit('setActiveBirdDisplayList', state.notableBirdsDisplayList);
            commit('sortBirdList', sort);
        } else {
            await dispatch('getAllBirds');
            commit('setActiveBirdList', state.allBirds);
            commit('setActiveBirdDisplayList', state.allBirdsDisplayList);
            commit('sortBirdList', sort);
        }
    },
    async getNotableBirds({ rootState, state, commit, dispatch }) {
        if (!state.notableBirds.length || shouldResendRequest(state.timeSinceNotableBirdsRetrieved)) {
            try {
                commit('setIsFetchingBirds', true);

                await dispatch("location/getUserLocation", null, { root: true });
                await dispatch("location/getRegionCode", null, { root: true });
                const json = await fetchRecentObservationsForType('notable', rootState.location.regionCode);

                const birdDisplayList = json.map(bird => bird.comName);

                commit('setNotableBirds', json);
                commit('setNotableBirdsDisplayList', [...new Set(birdDisplayList)]);
                commit('setTimeSinceNotableBirdsRetrieved', new Date());
            } catch (e) {
                commit('setIsFetchingBirds', false);
            }
            commit('setIsFetchingBirds', false);
        }
    },
    async getAllBirds({ rootState, state, commit, dispatch }) {
        if (!state.allBirds.length || shouldResendRequest(state.timeSinceAllBirdsRetrieved)) {
            try {
                commit('setIsFetchingBirds', true);

                await dispatch("location/getUserLocation", null, { root: true });
                await dispatch("location/getRegionCode", null, { root: true });
                const json = await fetchRecentObservationsForType('', rootState.location.regionCode);

                const birdDisplayList = json.map(bird => bird.comName);

                commit('setAllBirds', json);
                commit('setAllBirdsDisplayList', [...new Set(birdDisplayList)]);
                commit('setTimeSinceAllBirdsRetrieved', new Date());
            } catch (e) {
                commit('setIsFetchingBirds', false);
            }
            commit('setIsFetchingBirds', false);
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}