import * as localforage from 'localforage';
import { createPinia } from 'pinia';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import AboutPage from './pages/AboutPage.vue';
import BookPage from './pages/BookPage.vue';
import HomePage from './pages/HomePage.vue';
import './style.css';

/* Defining Routes */
const routes = [
	{ name: '/', path: '/:stats?/:search?/', component: HomePage },
	{ path: '/about', component: AboutPage },
	{ path: '/book/:id', name: 'book', component: BookPage },
];

/* Configure Local Forage Library */
localforage.config({
	name: 'store',
	storeName: 'app_store',
	driver: localforage.INDEXEDDB,
});

localforage.config({ driver: localforage.INDEXEDDB });

/* Create Pinia Store */
const pinia = createPinia();

/* Add Local Forage Plugin */
pinia.use(
	createPersistedStatePlugin({
		storage: {
			getItem: async (key) => {
				return localforage.getItem(key);
			},
			setItem: async (key, value) => {
				return localforage.setItem(key, value);
			},
			removeItem: async (key) => {
				return localforage.removeItem(key);
			},
		},
	})
);

/* Creater Router */
const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHashHistory(),
	routes, // short for `routes: routes`
});

createApp(App).use(router).use(pinia).mount('#app');
