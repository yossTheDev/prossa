import * as localforage from 'localforage';
import { createPinia } from 'pinia';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/bundle';

Framework7.use(Framework7Vue);

/* const Home = () => import('./pages/HomePage.vue');
const About = () => import('./pages/AboutPage.vue');
const Book = () => import('./pages/BookPage.vue'); */

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
				console.log('get', key)
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

createApp(App).use(pinia).mount('#app');
