<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import EbookReader from '../components/EbookReader.vue';
import { useAppStore } from '../stores/AppStore';
import { DateTime } from 'luxon';

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

onUnmounted(() => {
	clearInterval(timeInterval);
});
</script>

<template>
	<!--Epub Reader-->
	<EbookReader :id="id"></EbookReader>
</template>
