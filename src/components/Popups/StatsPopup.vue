<script setup lang="ts">
import {
	kBlockTitle,
	kList,
	kListItem,
	kNavbar,
	kPage,
	kPopup,
	kBlock,
	kLink,
} from 'konsta/vue';
import { DateTime, Duration, Interval } from 'luxon';
import { onMounted } from 'vue';
import { useAppStore } from '../../stores/AppStore';

const store = useAppStore();

onMounted(() => {
	/* Restart Reading Time on the end of the Month or Year */
	const readingTime = DateTime.fromISO(store.lastReadingTime!);

	if (store.lastReadingTime) {
		if (readingTime.year === DateTime.now().year) {
			if (readingTime.month !== DateTime.now().month) {
				/* Restart Reading Time This Month */
				store.setReadingTimeThisMonth(
					Interval.after(DateTime.now(), DateTime.now())
						.toDuration(['hours', 'minutes'])
						.toISO() as unknown as string
				);
			}
		} else {
			/* Restart Reading Time This Month */
			store.setReadingTimeThisMonth(
				Interval.after(DateTime.now(), DateTime.now())
					.toDuration(['hours', 'minutes'])
					.toISO() as unknown as string
			);
		}

		/* Restart Reading Streak */
		if (
			Interval.fromDateTimes(readingTime, DateTime.now()).toDuration(['days'])
				.days > 1
		) {
			store.daysOfReading = 0;
		}
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
			<kBlock>
				<kList>
					<kListItem
						:after="store.daysOfReading?.toString()"
						title="Days of Reading"
						subtitle="Read at least 10 minutes a day to increase your streak"
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
						subtitle="The time you have read this month"
					></kListItem>

					<kListItem
						:after="
							store.lastReadingTime
								? DateTime.fromISO(store.lastReadingTime).toRelative()!
								: 'Not yet'
						"
						title="Last Reading"
						subtitle="The last time you read"
					></kListItem>

					<kListItem
						:after="store.lastReadingTime ? DateTime.fromISO(store.lastReadingTime).toLocaleString()! : 'Not yet'"
						title="Last Reading Date"
						subtitle="The date of the last time you read"
					></kListItem>
				</kList>
			</kBlock>

			<kBlockTitle>Books</kBlockTitle>

			<kBlock>
				<kList>
					<kListItem
						title="Total Books"
						:after="store.books.length.toString()"
						subtitle="Total books in your library"
					></kListItem>
				</kList>
			</kBlock>
		</kPage>
	</kPopup>
</template>
