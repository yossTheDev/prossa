<script setup lang="ts">
import { f7List, f7ListItem, f7Navbar, f7Page } from 'framework7-vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { useAppStore } from '../stores/AppStore';

const store = useAppStore();
const props = defineProps({ id: String });

const getBookData = computed(() => store.getBook(props.id!));
</script>

<template>
	<f7Page>
		<f7Navbar
			large
			back-link="Back"
			back-link-show-text
			transparent
			:subtitle="getBookData?.metadata.title"
		></f7Navbar>

		<img
			class="z-auto mx-auto -mt-8 h-52 rounded-xl shadow"
			:src="JSON.parse(getBookData?.img!)"
		/>
		<f7List media-list>
			<f7ListItem
				title="Title"
				:subtitle="getBookData?.metadata.title"
			></f7ListItem>

			<f7ListItem
				title="Author"
				:subtitle="getBookData?.metadata.creator"
			></f7ListItem>
			<f7ListItem
				title="Pub Date"
				:subtitle="DateTime.fromISO(getBookData?.metadata.pubdate!).toLocaleString(DateTime.DATETIME_FULL) || 'undefined'"
			></f7ListItem>

			<f7ListItem
				title="Modified Date"
				:subtitle="getBookData?.metadata?.modified_date || 'undefined'"
			></f7ListItem>

			<f7ListItem
				title="Identifier"
				:subtitle="getBookData?.metadata?.identifier! || 'undefined'"
			></f7ListItem>

			<f7ListItem
				title="Publisher"
				:subtitle="getBookData?.metadata?.publisher! || 'undefined'"
			></f7ListItem>

			<f7ListItem
				title="Language"
				:subtitle="getBookData?.metadata?.language! || 'undefined'"
			></f7ListItem>

			<f7ListItem
				title="Rights"
				:subtitle="getBookData?.metadata?.rights! || 'undefined'"
			></f7ListItem>
		</f7List>
	</f7Page>
</template>
