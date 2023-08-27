<script setup lang="ts">
import { kListItem, kDialog, kDialogButton } from 'konsta/vue';
import { ref } from 'vue';
import { useAppStore } from '../stores/AppStore';

/* App Store */
const store = useAppStore();

const props = defineProps<{
	bookKey: string;
	title: string;
	description: string;
	creator: string;
	percent?: number;
	img: string;
}>();

const open = ref(false);

const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	open.value = true;
};

const handleDeleteBook = (e: MouseEvent) => {
	if (store.currentBook === props.bookKey) {
		store.setCurrentBook('');
	}
	store.deleteBook(props.bookKey);
	open.value = false;
};
</script>

<template>
	<k-list-item
		@contextmenu="handleContextMenu"
		:chevron-material="false"
		@click="$router.push({ name: 'book', params: { id: props.bookKey } })"
		link
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
	</k-list-item>

	<Teleport to="#popup-target">
		<k-dialog class="z-50" :opened="open" @backdropclick="() => (open = false)">
			<template #title>Delete Book?</template>

			<template #buttons>
				<k-dialog-button @click="handleDeleteBook"> Delete </k-dialog-button>
			</template>
		</k-dialog>
	</Teleport>
</template>
