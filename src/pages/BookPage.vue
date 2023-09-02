<script setup lang="ts">
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { kPage } from 'konsta/vue';
import { DateTime, Duration, Interval } from 'luxon';
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import EbookReader from '../components/EbookReader.vue';
import { useAppStore } from '../stores/AppStore';

/* App Store */
const store = useAppStore();

/* Get book ID */
const id = useRoute().params.id as unknown as string;

let startTime: DateTime;

onMounted(() => {
	/* Set Current Book ID */
	store.setCurrentBook(id);

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
	<k-page class="relative flex h-full w-full flex-auto overflow-hidden">
		<!--Epub Reader-->
		<EbookReader :id="id"></EbookReader>
	</k-page>
</template>
