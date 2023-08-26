<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAppStore } from '../stores/AppStore';
import { kListGroup, kListItem, kList, kBlockTitle } from 'konsta/vue';
import BookItem from './BookItem.vue';

/* App Store */
const store = useAppStore();

interface Group {
	name: string;
	books: any;
}

const groups = ref<Group[]>([]);

watch([store.books], () => {
	getGroups();
});

const getGroups = () => {
	groups.value = [];
	/* Get Groups */
	for (const book of store.books) {
		const fistLetter = book.metadata.title[0];

		if (!groups.value.find((item) => item.name === fistLetter)) {
			groups.value = [...groups.value, { name: fistLetter, books: [book] }];
		} else {
			groups.value = groups.value.map((item) =>
				item.name === fistLetter
					? { ...item, books: [...item.books, book] }
					: item
			);
		}
	}

	/* Sort */
	groups.value = groups.value.sort((a, b) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();

		if (nameA < nameB) return -1;

		if (nameA > nameB) return 1;

		return 0;
	});
};

onMounted(() => {
	getGroups();
});
</script>

<template>
	<k-block-title>Library</k-block-title>
	<k-list strong-ios outline-ios>
		<k-list-group :key="group.name" v-for="group in groups">
			<k-list-item
				:title="group.name"
				group-title
				class="sticky my-1 material:top-16-safe ios:top-11-safe md:hidden"
			/>

			<k-list-item
				:title="group.name"
				group-title
				class="my-1 hidden md:flex"
			/>
			<BookItem
				:key="book.key"
				v-for="book in group.books"
				:book-key="book.key"
				:creator="book.metadata.creator"
				:description="book.metadata.description"
				:title="book.metadata.title"
				:img="book.img"
			></BookItem>
		</k-list-group>
	</k-list>
</template>
