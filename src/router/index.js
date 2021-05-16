import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '/src/pages/HomePage.vue';
import AboutPage from '/src/pages/AboutPage.vue';
import BirdDetailPage from '/src/pages/BirdDetailPage.vue';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: AboutPage
    },
    {
        path: '/bird',
        name: 'BirdPage',
        component: BirdDetailPage,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;