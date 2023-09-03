<script setup lang="ts">
import { KeepAwake } from '@capacitor-community/keep-awake';
import { f7, f7Page } from 'framework7-vue';
import { DateTime, Duration, Interval } from 'luxon';
import { onMounted, onUnmounted } from 'vue';
import EbookReader from '../components/EbookReader.vue';
import { useAppStore } from '../stores/AppStore';

const props = defineProps({ f7router: Object, f7route: Object, id: String });

/* App Store */
const store = useAppStore();

let startTime: DateTime;

onMounted(() => {
	/* Set Current Book ID */
	store.setCurrentBook(props.id!);

	startTime = DateTime.now();

	f7.statusbar.hide();
	f7.statusbar.overlaysWebView(true);
	/* Enable Keep Awake */
	KeepAwake.keepAwake();
});

onUnmounted(() => {
	/* Show StatusBar */
	f7.statusbar.show();
	f7.statusbar.overlaysWebView(true);

	/* Enable Keep Awake */
	KeepAwake.allowSleep();

	/* Update Reading Time in Store */
	store.setReadingTimeThisMonth(
		Interval.fromDateTimes(startTime, DateTime.now())
			.toDuration(['hours', 'minutes'])
			.plus(Duration.fromISO(store.readingTimeThisMonth))
			.toISO() as unknown as string
	);

	if (
		Interval.fromDateTimes(startTime, DateTime.now()).toDuration(['minutes'])
			.minutes >= 10
	) {
		if (
			DateTime.fromISO(store.lastReadingTime!).toISODate() ===
			DateTime.now().minus({ days: 1 }).toISODate()
		) {
			store.addDayOfReading();
			console.log('Add Day');
		} else if (!store.lastReadingTime) {
			store.addDayOfReading();
		}

		store.lastReadingTime = DateTime.now().toISO() as unknown as string;
	}
});
</script>

<template>
	<f7Page>
		<!--Epub Reader-->
		<EbookReader :id="id!"></EbookReader>
	</f7Page>
</template>
