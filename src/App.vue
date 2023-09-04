<script setup lang="ts">
import { useDark } from '@vueuse/core';
import {
	f7App,
	f7List,
	f7ListItem,
	f7Navbar,
	f7Page,
	f7Panel,
	f7View,
} from 'framework7-vue';
import { kProvider } from 'konsta/vue';
import { onMounted } from 'vue';
import StatsPopup from './components/Popups/StatsPopup.vue';
import BookInfo from './pages/BookInfo.vue';
import BookPage from './pages/BookPage.vue';
import HomePage from './pages/HomePage.vue';

// const router = useRouter();
const dark = useDark();

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
				androidTextColor: dark ? 'white' : 'black',
			}"
			v-bind="{
				darkMode: 'auto',
				routes: [
					{ path: '/', component: HomePage },
					{ path: '/book/:id', component: BookPage },
					{
						path: '/book_info/',
						options: { props: { id: '' } },
						component: BookInfo,
					},
				],
			}"
		>
			<f7View browser-history main></f7View>

			<div id="popup-target"></div>

			<StatsPopup></StatsPopup>

			<f7Panel swipe left>
				<f7View>
					<f7Page>
						<f7Navbar large title="Prossa"></f7Navbar>

						<f7List menu-list>
							<f7ListItem>Home</f7ListItem>
							<f7ListItem>About</f7ListItem>
						</f7List>
					</f7Page>
				</f7View>
			</f7Panel>
		</f7App>
	</k-provider>
</template>
