<script setup lang="ts">
import { IconHome, IconInfoCircle, IconSettings } from '@tabler/icons-vue';
import { useDark } from '@vueuse/core';
import {
	f7,
	f7App,
	f7List,
	f7ListItem,
	f7Navbar,
	f7Page,
	f7Panel,
	f7View,
} from 'framework7-vue';
import { kProvider } from 'konsta/vue';
import { onMounted, ref, watch } from 'vue';
import StatsPopup from './components/Popups/StatsPopup.vue';
import AboutPage from './pages/AboutPage.vue';
import BookInfo from './pages/BookInfo.vue';
import BookPage from './pages/BookPage.vue';
import HomePage from './pages/HomePage.vue';
import SettingPage from './pages/SettingPage.vue';
import { useAppStore } from './stores/AppStore';

const dark = useDark();
const store = useAppStore();
const page = ref('/');

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

watch(store, () => {
	f7.setDarkMode(store.Theme);
	f7.setColorTheme(store.Color);
});

const goTo = (to: string) => {
	page.value = to;
	f7.views.main.router.navigate(to, { history: false });
};
</script>

<template>
	<k-provider theme="parent">
		<f7App
			v-bind="{
				name: 'Prossa',
				darkMode: store.Theme,
				routes: [
					{ path: '/', component: HomePage },
					{ path: '/about/', component: AboutPage },
					{ path: '/settings/', component: SettingPage },
					{ path: '/book/:id', component: BookPage },
					{
						path: '/book_info/',
						options: { props: { id: '' } },
						component: BookInfo,
					},
				],
				statusbar: {
					enabled: true,
					androidOverlaysWebView: true,
					androidTextColor: dark ? 'white' : 'black',
				},
			}"
		>
			<f7View browser-history main></f7View>

			<div id="popup-target"></div>

			<StatsPopup></StatsPopup>

			<f7Panel swipe left>
				<f7Page>
					<f7Navbar large title="Prossa"></f7Navbar>

					<f7List menu-list>
						<f7ListItem
							@click="() => goTo('/')"
							:selected="page === '/'"
							link
							title="Home"
						>
							<template #media>
								<IconHome></IconHome>
							</template>
						</f7ListItem>

						<f7ListItem
							link
							@click="() => goTo('/settings/')"
							:selected="page === '/settings/'"
							title="Settings"
						>
							<template #media>
								<IconSettings></IconSettings>
							</template>
						</f7ListItem>

						<f7ListItem
							@click="() => goTo('/about/')"
							link
							:selected="page === '/about/'"
							title="About"
						>
							<template #media>
								<IconInfoCircle></IconInfoCircle>
							</template>
						</f7ListItem>
					</f7List>
				</f7Page>
			</f7Panel>
		</f7App>
	</k-provider>
</template>
