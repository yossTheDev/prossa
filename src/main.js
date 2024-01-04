import * as localforage from 'localforage';
import { createPinia } from 'pinia';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import axios from 'axios';
import _ from 'lodash';
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
const url = 'https://us-central1-superfunction-c5136.cloudfunctions.net/webApi/api/v1/functions/-NnKoefOW3_eWYUvyHWF/run'
/* Create Pinia Store */
const pinia = createPinia();

/* Add Local Forage Plugin */
pinia.use(
	createPersistedStatePlugin({
		storage: {
			getItem: async (key) => {
				console.log('get', key)
				const data = {
					key,
				};
				try {
				  const response = await axios.get(`${url}?key=${key}`);
				  return response.data.body
				} catch (error) {
				  console.error('Błąd przy zapisywaniu danych:', error);
				}
				// return localforage.getItem(key);
			},
			setItem: _.debounce(async (key, value) => {
				const data = {
				  key,
				  value,
				};
				try {
				  const response = await axios.put(url, data);
				  return response.data.body;
				} catch (error) {
				  console.error('Błąd przy zapisywaniu danych:', error);
				}
			  }, 3000),
			removeItem: async (key) => {
				return localforage.removeItem(key);
			},
		},
	})
);

createApp(App).use(pinia).mount('#app');
