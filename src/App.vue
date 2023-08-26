<script setup lang="ts">
import { kApp, kPage, kProvider } from 'konsta/vue';
import { useDark } from '@vueuse/core';
import { onMounted } from 'vue';
import { StatusBar, Style } from '@capacitor/status-bar';

onMounted(() => {
	useDark({
		onChanged: (isDark) => {
			if (isDark) {
				StatusBar.setBackgroundColor({ color: '#1B1B1F' });
				StatusBar.setStyle({ style: Style.Dark });
			} else {
				StatusBar.setBackgroundColor({ color: '#F1F3FC' });
				StatusBar.setStyle({ style: Style.Light });
			}
		},
	});
});
</script>

<template>
	<k-provider theme="md">
		<k-app theme="material">
			<div class="flex h-screen w-screen flex-auto overflow-hidden">
				<k-page
					class="relative flex flex-col bg-md-light-surface-2 dark:bg-md-dark-surface-2"
				>
					<!--Router Outlet-->
					<router-view></router-view>
				</k-page>
			</div>
		</k-app>
	</k-provider>
</template>
