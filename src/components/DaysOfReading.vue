<script setup lang="ts">
import { useAppStore } from '../stores/AppStore';
import { IconCalendarStats } from '@tabler/icons-vue';

/* App Store */
const store = useAppStore();
</script>

<template>
	<!--Stats-->
	<div class="flex select-none gap-1 p-1">
		<div
			class="mx-2 ml-auto flex flex-row gap-1 rounded-full bg-base-200 p-2 dark:text-white"
		>
			<IconCalendarStats></IconCalendarStats>
			<p class="my-auto mr-1 hidden font-bold md:block">Days Of Reading:</p>
			<p class="my-auto">{{ store.daysOfReading }}</p>
		</div>
	</div>
</template>
