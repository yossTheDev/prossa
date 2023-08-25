<script setup lang="ts">
import { kApp, kPage, kProvider } from 'konsta/vue';
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
