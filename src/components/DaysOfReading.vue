<script setup lang="ts">
import { useAppStore } from '../stores/AppStore';
import { IconCalendarStats } from '@tabler/icons-vue';
import { kChip } from 'konsta/vue';

/* App Store */
const store = useAppStore();
</script>

<template>
	<!--Stats-->
	<k-chip class="m-0.5">
		<template #media>
			<IconCalendarStats class="mr-1"></IconCalendarStats>
		</template>
		Days Of Reading: {{ ' ' }}
		{{ store.daysOfReading }}
	</k-chip>
</template>
