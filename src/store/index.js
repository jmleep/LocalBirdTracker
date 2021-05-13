import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            bird: undefined,
            userLocation: {
                lat: undefined,
                lon: undefined
            }
        }
    },
    getters: {
        getBird(state) {
            return state.bird;
        },
        getUserLocation(state) {
            return state.userLocation;
        }
    },
    mutations: {
        setBird(state, bird) {
            state.bird = bird;
        },
        setUserLocation(state, location) {
            state.userLocation = location;
        }
    }
});

export default store;
