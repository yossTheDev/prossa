<script setup lang="ts">
import { f7Page } from 'framework7-vue';
import EbookReader from '../components/EbookReader.vue';
import { useAppStore } from '../stores/AppStore';
import { onMounted, onUnmounted } from 'vue';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { DateTime, Interval, Duration } from 'luxon';

const props = defineProps({ f7router: Object, f7route: Object, id: String });
const store = useAppStore();

let startTime: DateTime;

onMounted(() => {
	/* Set Current Book ID */
	store.setCurrentBook(props.id!);

	startTime = DateTime.now();

	/* Hide Status Bar */
	if (Capacitor.isNativePlatform()) {
		StatusBar.hide();
		StatusBar.setOverlaysWebView({ overlay: true });
	}

	/* Enable Keep Awake */
	KeepAwake.keepAwake();
});

onUnmounted(() => {
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
		<EbookReader :id="id!"></EbookReader>
	</f7Page>
</template>
