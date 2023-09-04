<script setup lang="ts">
import { IconTrash, IconInfoCircle } from '@tabler/icons-vue';
import { ref } from 'vue';
import { useAppStore } from '../stores/AppStore';
import {
	f7ListItem,
	f7,
	f7SwipeoutActions,
	f7SwipeoutButton,
	f7Progressbar,
} from 'framework7-vue';

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

const openInfoPage = () => {
	f7.views.main.router.navigate('/book_info/', {
		props: { id: props.bookKey },
	});
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
		media-item
		swipeout
		@swipeout:deleted="handleDeleteBook"
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
			<f7Progressbar
				v-if="percent && percent * 100 > 0"
				:progress="percent * 100"
			></f7Progressbar>
		</template>

		<f7SwipeoutActions left>
			<f7SwipeoutButton
				confirm-title="Delete"
				confirm-text="Are you sure?"
				delete
				><IconTrash></IconTrash
			></f7SwipeoutButton>
		</f7SwipeoutActions>

		<f7SwipeoutActions right>
			<f7SwipeoutButton @click="openInfoPage">
				<IconInfoCircle></IconInfoCircle>
			</f7SwipeoutButton>
		</f7SwipeoutActions>
	</f7ListItem>
</template>
