<script setup lang="ts">
import {
	kBlockTitle,
	kList,
	kListItem,
	kNavbar,
	kPage,
	kPopup,
} from 'konsta/vue';
// eslint-disable-next-line no-unused-vars
import { DateTime, Duration, Interval } from 'luxon';
import { onMounted } from 'vue';
import { useAppStore } from '../../stores/AppStore';

const store = useAppStore();

onMounted(() => {
	/* Restart Reading Time on the end of the Month or Year */
	const readingTime = DateTime.fromISO(store.lastReadingTime);

	if (readingTime.year === DateTime.now().year) {
		if (readingTime.month !== DateTime.now().month) {
			/* Restart Reading Time */
			store.setReadingTimeThisMonth(
				Interval.after(DateTime.now(), DateTime.now())
					.toDuration(['hours', 'minutes'])
					.toISO() as unknown as string
			);
		}
	} else {
		/* Restart Reading Time */
		store.setReadingTimeThisMonth(
			Interval.after(DateTime.now(), DateTime.now())
				.toDuration(['hours', 'minutes'])
				.toISO() as unknown as string
		);
	}
});
</script>

<template>
	<kPopup
		@backdropclick="$router.replace('/')"
		:opened="$route.params.stats === 'stats'"
	>
		<kPage>
			<kNavbar large title="Stats">
				<template #right>
					<div class="fixed right-0 mr-1">
						<kLink @click="$router.replace('/')" navbar>Cancel</kLink>
					</div></template
				>
			</kNavbar>

			<kBlockTitle>Reading</kBlockTitle>
			<kList>
				<kListItem
					:after="store.daysOfReading?.toString()"
					title="Days of Reading"
				></kListItem>

				<kListItem
					:after="
						Duration.fromISO(store.readingTimeThisMonth).toHuman({
							listStyle: 'short',
							unitDisplay: 'short',
							maximumFractionDigits: 0,
						})
					"
					title="Reading Time"
				></kListItem>

				<kListItem
					:after="DateTime.fromISO(store.lastReadingTime).toRelative()!"
					title="Last Reading Reading Time"
				></kListItem>

				<kListItem
					:after="DateTime.fromISO(store.lastReadingTime).toLocaleString()!"
					title="Last Reading Reading Date"
				></kListItem>
			</kList>

			<kBlockTitle>Books</kBlockTitle>

			<kList>
				<kListItem title="Total Books" :after="store.books.length"></kListItem>
			</kList>
		</kPage>
	</kPopup>
</template>
