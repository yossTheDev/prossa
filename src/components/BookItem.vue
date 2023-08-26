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
	img: string;
}>();

const open = ref(false);

const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	open.value = true;
};

const handleDeleteBook = (e: MouseEvent) => {
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
		:subtitle="creator"
		:text="
			description.length > 240 ? description.slice(0, 237) + '...' : description
		"
	>
		<template #media>
			<img
				class="mx-2 material:w-24 ios:w-20"
				:src="JSON.parse(props.img)"
				width="80"
				alt="demo"
			/>
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
