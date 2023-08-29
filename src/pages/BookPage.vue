<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import EbookReader from '../components/EbookReader.vue';
import { useAppStore } from '../stores/AppStore';
import { DateTime, Duration, Interval } from 'luxon';
import { kPage } from 'konsta/vue';
import { StatusBar } from '@capacitor/status-bar';
import { KeepAwake } from '@capacitor-community/keep-awake';

/* App Store */
const store = useAppStore();

/* Get book ID */
const id = useRoute().params.id as unknown as string;

/* Set Current Book ID */
store.setCurrentBook(id);

let time = 0;

const timeInterval = setInterval(() => {
	time++;

	// console.log(time);

	if (time === 60 * 10) {
		if (
			DateTime.fromISO(store.lastReadingTime).toISODate() ===
			DateTime.now().minus({ days: 1 }).toISODate()
		) {
			store.addDayOfReading();
			console.log('Add Day');
		} else {
			store.daysOfReading = 1;
		}
	}

	store.lastReadingTime = DateTime.now().toISO() as unknown as string;
}, 1000);

let startTime: DateTime;

onMounted(() => {
	startTime = DateTime.now();

	/* Hide Status Bar */
	StatusBar.hide();
	StatusBar.setOverlaysWebView({ overlay: true });

	/* Enable Keep Awake */
	KeepAwake.keepAwake();
});

onUnmounted(() => {
	clearInterval(timeInterval);

	/* Update Reading Time in Store */
	store.setReadingTimeThisMonth(
		Interval.fromDateTimes(startTime, DateTime.now())
			.toDuration(['hours', 'minutes'])
			.plus(Duration.fromISO(store.readingTimeThisMonth))
			.toISO() as unknown as string
	);
});
</script>

<template>
	<k-page class="relative flex h-full w-full flex-auto overflow-hidden">
		<!--Epub Reader-->
		<EbookReader :id="id"></EbookReader>
	</k-page>
</template>
