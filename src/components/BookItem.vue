<script setup lang="ts">
import { useAppStore } from '../stores/AppStore';
import { Float } from '@headlessui-float/vue';
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

const contextMenu = ref(false);

const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	contextMenu.value = !contextMenu.value;
};

const handleDeleteBook = (e: MouseEvent) => {
	console.log(props.bookKey);
	store.deleteBook(props.bookKey);
};
</script>

<template>
	<Float placement="left-start" :show="contextMenu" as="div">
		<div
			class="flex flex-auto cursor-pointer select-none transition-all active:scale-90"
			@click="$router.push({ name: 'book', params: { id: props.bookKey } })"
			@contextmenu="handleContextMenu"
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
		<div class="rounded-xl bg-base-200 p-4 shadow dark:text-white">
			<button @click="handleDeleteBook">Delete</button>
		</div>
	</Float>
</template>
