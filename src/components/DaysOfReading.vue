<script setup lang="ts">
import { useAppStore } from '../stores/AppStore';
import { IconCalendarStats } from '@tabler/icons-vue';
import { DateTime } from 'luxon';
/* App Store */
const store = useAppStore();

if (
	DateTime.fromISO(store.lastReadingTime).day ===
	DateTime.now().minus({ days: 1 }).day
) {
	store.addDayOfReading();
	console.log('Add Day');
}
</script>

<template>
	<!--Stats-->
	<div class="flex select-none gap-1 p-1">
		<div
			class="mx-2 ml-auto flex flex-row gap-1 rounded-2xl bg-base-200 p-2 dark:text-white"
		>
			<IconCalendarStats></IconCalendarStats>
			<p class="mr-1 font-bold">Days Of Reading:</p>
			<p>{{ store.daysOfReading }}</p>
		</div>
	</div>
</template>
