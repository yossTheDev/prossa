<script setup lang="ts">
import { kList, kListItem, kBlock } from 'konsta/vue';
import {
	f7Popup,
	f7Link,
	f7Navbar,
	f7Page,
	f7View,
	f7BlockTitle,
} from 'framework7-vue';
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
					Duration.fromMillis(0).toISO() as unknown as string
				);
			}
		} else {
			/* Restart Reading Time This Month */
			store.setReadingTimeThisMonth(
				Duration.fromMillis(0).toISO() as unknown as string
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
	<f7Popup swipe-to-close close-on-escape animate class="stats-popup">
		<f7View>
			<f7Page>
				<f7Navbar transparent large title="Stats">
					<template #right>
						<f7Link popup-close navbar>Cancel</f7Link>
					</template>
				</f7Navbar>

				<f7BlockTitle>Reading</f7BlockTitle>
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

				<f7BlockTitle>Books</f7BlockTitle>

				<kBlock>
					<kList>
						<kListItem
							title="Total Books"
							:after="store.books.length.toString()"
							subtitle="Total books in your library"
						></kListItem>
					</kList>
				</kBlock>
			</f7Page>
		</f7View>
	</f7Popup>
</template>
