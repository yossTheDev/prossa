<script setup lang="ts">
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IconHome, IconInfoCircle } from '@tabler/icons-vue';
import { useDark } from '@vueuse/core';
import {
	kApp,
	kButton,
	kMenuList,
	kMenuListItem,
	kNavbar,
	kPage,
	kPanel,
	kProvider,
} from 'konsta/vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const canGoBack = ref(false);

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
	App.addListener('backButton', () => {
		if (!canGoBack.value) {
			App.exitApp();
		} else {
			router.back();
		}
	});

	/* Change Status Bar Colors based on Theme */
	useDark({
		onChanged: (isDark) => {
			if (isDark) {
				StatusBar.setBackgroundColor({ color: '#272931' });
				StatusBar.setStyle({ style: Style.Dark });
			} else {
				StatusBar.setBackgroundColor({ color: '#EAEEFA' });
				StatusBar.setStyle({ style: Style.Light });
			}
		},
	});
});

const moveTo = (path: string) => {
	router.replace(path);
};
</script>

<template>
	<div id="popup-target"></div>

	<k-provider theme="md">
		<k-app theme="material">
			<div class="relative flex h-screen w-screen flex-auto overflow-hidden">
				<!--Drawer Menu-->
				<kPanel
					:opened="$route.params.menu === 'menu'"
					@backdropclick="$router.replace({ name: route.name! })"
				>
					<k-page>
						<k-navbar large title="Prossa"> </k-navbar>

						<kMenuList>
							<kMenuListItem
								@click="() => moveTo('/')"
								:active="$route.path === '/'"
								title="Home"
							>
								<template #media>
									<IconHome class="ml-3 mr-2"></IconHome>
								</template>
							</kMenuListItem>

							<kMenuListItem
								@click="() => moveTo('/about')"
								:active="$route.path === '/about'"
								title="About"
							>
								<template #media>
									<IconInfoCircle class="ml-3 mr-2"></IconInfoCircle>
								</template>
							</kMenuListItem>
						</kMenuList>
					</k-page>
				</kPanel>

				<!--Side Menu-->
				<div
					v-if="$route.name !== 'book'"
					class="hidden flex-col gap-2 px-1 py-2 dark:bg-md-dark-surface md:flex"
				>
					<kButton
						large
						rounded
						tonal
						:clear="$route.path !== '/'"
						@click="$router.push('/')"
					>
						<IconHome></IconHome>
					</kButton>

					<kButton
						large
						rounded
						tonal
						class="mt-auto"
						:clear="$route.path !== '/about'"
						@click="$router.push('/about')"
					>
						<IconInfoCircle></IconInfoCircle>
					</kButton>
				</div>

				<!--Router Outlet-->
				<router-view></router-view>
			</div>
		</k-app>
	</k-provider>
</template>
