<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { f7App, f7Panel, f7View } from 'framework7-vue';
import { kProvider } from 'konsta/vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import StatsPopup from './components/Popups/StatsPopup.vue';
import BookPage from './pages/BookPage.vue';

// const router = useRouter();
const route = useRoute();
const canGoBack = ref(false);
const dark = useDark();

watch(route, () => {
	/* Define if the user can go back through navigation */
	if (
		route.name === ('/' || 'about' || 'book') &&
		!route.params.stats &&
		!route.params.search &&
		!route.params.menu
	) {
		canGoBack.value = false;
	} else {
		canGoBack.value = true;
	}
});

onMounted(() => {
	/* Add back Button listener for Android */
	/* App.addListener('backButton', () => {
		if (!canGoBack.value) {
			App.exitApp();
		} else {
			router.back();
		}
	}); */
	/* Change Status Bar Colors based on Theme */
	/* useDark({
		onChanged: (isDark) => {
			if (isDark) {
				StatusBar.setBackgroundColor({ color: '#272931' });
				StatusBar.setStyle({ style: Style.Dark });
			} else {
				StatusBar.setBackgroundColor({ color: '#EAEEFA' });
				StatusBar.setStyle({ style: Style.Light });
			}
		},
	}); */
});
</script>

<template>
	<k-provider theme="parent">
		<f7App
			:statusbar="{
				enabled: true,
				androidOverlaysWebView: true,
				androidTextColor: dark ? 'light' : 'dark',
			}"
			v-bind="{
				dark: dark,
				routes: [
					{ path: '/', component: HomePage },
					{ path: '/book/:id', component: BookPage },
				],
			}"
		>
			<f7View browser-history main></f7View>

			<div id="popup-target"></div>

			<StatsPopup></StatsPopup>

			<f7Panel swipe left></f7Panel>
		</f7App>
	</k-provider>
</template>
