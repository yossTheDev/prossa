<script setup lang="ts">
import { KeepAwake } from '@capacitor-community/keep-awake';
import { useDark } from '@vueuse/core';
import { f7, f7Page } from 'framework7-vue';
import { DateTime, Duration, Interval } from 'luxon';
import { onMounted, onUnmounted } from 'vue';
import EbookReader from '../components/EbookReader.vue';
import { useAppStore } from '../stores/AppStore';

const props = defineProps({ f7router: Object, f7route: Object, id: String });

/* App Store */
const store = useAppStore();
const dark = useDark();

let startTime: DateTime;

onMounted(() => {
	/* Set Current Book ID */
	store.setCurrentBook(props.id!);

	startTime = DateTime.now();

	f7.statusbar.overlaysWebView(true);
	f7.statusbar.hide();
	/* Enable Keep Awake */
	KeepAwake.keepAwake();
});

onUnmounted(() => {
	/* Show StatusBar */
	f7.statusbar.show();
	f7.statusbar.overlaysWebView(true);

	if (dark.value) {
		f7.statusbar.setTextColor('white');
	} else {
		f7.statusbar.setTextColor('black');
	}

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
	<f7Page @page:beforeout="() => f7.popup.close('.menu_popup')">
		<!--Epub Reader-->
		<EbookReader :id="id!"></EbookReader>
	</f7Page>
</template>
