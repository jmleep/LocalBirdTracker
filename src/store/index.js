import { createStore } from 'vuex';
import location from '/src/store/location';
import birds from '/src/store/birds';

const store = createStore({
    modules: {
        birds,
        location
    }
});

export default store;
