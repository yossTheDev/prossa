<script setup lang="ts">
import { IconTrash } from '@tabler/icons-vue';
import { kButton, kLink, kList, kListItem, kToolbar } from 'konsta/vue';
import { DateTime } from 'luxon';
import { ref } from 'vue';
import { useAppStore } from '../stores/AppStore';
import { f7Sheet, f7ListItem, f7 } from 'framework7-vue';

/* App Store */
const store = useAppStore();

const props = defineProps<{
	bookKey: string;
	title: string;
	description: string;
	creator: string;
	percent?: number;
	img: string;
	metadata?: {
		title: string;
		creator: string;
		description: string;
		pubdate: string;
		publisher: string;
		identifier: string;
		language: string;
		rights: string;
		modified_date: string;
		layout: string;
		orientation: string;
		flow: string;
		viewport: string;
		spread: string;
	};
}>();

const open = ref(false);

const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	f7.sheet.open(`#book_sheet_${props.bookKey}`);
};

const handleDeleteBook = () => {
	if (store.currentBook === props.bookKey) {
		store.setCurrentBook('');
	}
	store.deleteBook(props.bookKey);
	open.value = false;
};
</script>

<template>
	<f7ListItem
		media-list
		media-item
		@contextmenu="handleContextMenu"
		:link="'/book/' + bookKey"
		:title="title"
		:text="
			description.length > 200 ? description.slice(0, 197) + '...' : description
		"
		:header="creator"
	>
		<template #media>
			<img
				class="mx-2 material:w-24 ios:w-20"
				:src="JSON.parse(props.img)"
				width="80"
				alt="demo"
			/>
		</template>

		<template #footer>
			<div
				v-if="percent && percent * 100 > 0"
				class="flex h-1.5 w-full overflow-hidden rounded-full bg-md-light-surface-5 dark:bg-md-dark-surface-3 md:mt-2 md:w-80"
			>
				<div
					:style="{ width: percent * 100 + '%' }"
					class="flex rounded-r-full bg-primary"
				></div>
			</div>
		</template>
	</f7ListItem>

	<Teleport to="#popup-target">
		<f7Sheet backdrop :id="`book_sheet_${metadata?.identifier}`">
			<kToolbar top>
				<div class="fixed right-0 mr-2">
					<kLink @click="() => (open = false)" toolbar> Close </kLink>
				</div>
			</kToolbar>

			<div
				class="flex h-full flex-col overflow-hidden bg-md-light-surface dark:bg-md-dark-surface"
			>
				<kList class="flex h-full flex-col overflow-auto">
					<kListItem title="Title" :subtitle="title"></kListItem>

					<kListItem title="Author" :subtitle="creator"></kListItem>
					<kListItem
						title="Pub Date"
						:subtitle=" DateTime.fromISO(metadata?.pubdate!).toLocaleString(DateTime.DATETIME_FULL) || 'undefined'"
					></kListItem>

					<kListItem
						title="Modified Date"
						:subtitle="metadata?.modified_date || 'undefined'"
					></kListItem>

					<kListItem
						title="Identifier"
						:subtitle="metadata?.identifier! || 'undefined'"
					></kListItem>

					<kListItem
						title="Publisher"
						:subtitle="metadata?.publisher! || 'undefined'"
					></kListItem>

					<kListItem
						title="Language"
						:subtitle="metadata?.language! || 'undefined'"
					></kListItem>

					<kListItem
						title="Rights"
						:subtitle="metadata?.rights! || 'undefined'"
					></kListItem>
				</kList>

				<div class="mx-6 my-2">
					<kButton @click="handleDeleteBook">
						<IconTrash></IconTrash>
						Delete
					</kButton>
				</div>
			</div>
		</f7Sheet>
	</Teleport>
</template>
