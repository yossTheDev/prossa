<script setup lang="ts">
import { useAppStore } from '../stores/AppStore';
import { ref } from 'vue';

/* App Store */
const store = useAppStore();

const props = defineProps<{
	bookKey: string;
	title: string;
	description: string;
	creator: string;
	img: string;
}>();

const open = ref('');

const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	if (open.value === '') {
		open.value = 'dropdown-open';
	} else {
		open.value = '';
	}
};

const handleDeleteBook = (e: MouseEvent) => {
	store.deleteBook(props.bookKey);
};
</script>

<template>
	<div :class="'dropdown-bottom dropdown-end dropdown ' + open">
		<div
			tabindex="0"
			class="flex flex-auto cursor-pointer select-none transition-all active:scale-90"
			@click="$router.push({ name: 'book', params: { id: props.bookKey } })"
			@contextmenu="handleContextMenu"
			@blur="open = ''"
		>
			<div class="flex min-w-fit p-2">
				<img
					class="h-36 rounded shadow-sm hover:scale-105 hover:shadow-2xl hover:transition-all md:mx-auto md:h-60 md:w-44 md:shadow-2xl"
					:src="JSON.parse(props.img)"
				/>
			</div>

			<div class="flex flex-auto flex-col p-2 text-gray-400 md:hidden">
				<div class="my-auto">
					<p class="font-bold">{{ props.title }}</p>
					<p class="text-xs">{{ props.creator }}</p>
				</div>
			</div>
		</div>

		<!-- Context Menu -->
		<div
			tabindex="0"
			class="dropdown-content rounded-xl bg-base-200 p-4 shadow dark:text-white"
			@blur="open = ''"
		>
			<button @click="handleDeleteBook">Delete</button>
		</div>
	</div>
</template>
