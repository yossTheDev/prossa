<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import EbookReader from '../components/EbookReader.vue';
import { useAppStore } from '../stores/AppStore';
import { DateTime, Duration, Interval } from 'luxon';
import { kPage } from 'konsta/vue';

/* App Store */
const store = useAppStore();

/* Get book ID */
const id = useRoute().params.id as unknown as string;

/* Set Current Book ID */
store.setCurrentBook(id);

let time = 0;

const timeInterval = setInterval(() => {
	time++;

	console.log(time);

	if (time === 60 * 10) {
		store.lastReadingTime = DateTime.now().toISO() as unknown as string;

		if (
			DateTime.fromISO(store.lastReadingTime).day ===
			DateTime.now().minus({ days: 1 }).day
		) {
			store.addDayOfReading();
			console.log('Add Day');
		}
	}
}, 1000);

const startTime = DateTime.now();

onUnmounted(() => {
	clearInterval(timeInterval);

	if (DateTime.fromISO(store.lastReadingTime).month !== DateTime.now().month) {
		/* Restart Reading Time */
		store.setReadingTimeThisMonth(
			Interval.after(DateTime.now(), DateTime.now())
				.toDuration(['hours', 'minutes'])
				.toISO() as unknown as string
		);
	} else {
		/* Update Reading Time in Store */
		store.setReadingTimeThisMonth(
			Interval.fromDateTimes(startTime, DateTime.now())
				.toDuration(['hours', 'minutes'])
				.plus(Duration.fromISO(store.readingTimeThisMonth))
				.toISO() as unknown as string
		);
	}
});
</script>

<template>
	<k-page class="relative flex h-full w-full flex-auto overflow-hidden">
		<!--Epub Reader-->
		<EbookReader :id="id"></EbookReader>
	</k-page>
</template>
