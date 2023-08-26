<script setup lang="ts">
import { kApp, kProvider } from 'konsta/vue';
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
	<div id="popup-target"></div>

	<k-provider theme="md">
		<k-app theme="material">
			<div class="relative flex h-screen w-screen flex-auto overflow-hidden">
				<!--Router Outlet-->
				<router-view></router-view>
			</div>
		</k-app>
	</k-provider>
</template>
