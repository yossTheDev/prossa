<script setup lang="ts">
import { kBlockTitle, kList, kListGroup, kListItem } from 'konsta/vue';
import { computed } from 'vue';
import { Book } from '../stores/AppStore';
import BookItem from './BookItem.vue';

/* App Store */
const props = defineProps<{
	books: Book[];
}>();

interface Group {
	name: string;
	books: any;
}

const getGroups = computed(() => {
	let groups: Group[] = [];

	/* Get Groups */
	for (const book of props.books) {
		const fistLetter = book.metadata.title[0];

		if (!groups.find((item) => item.name === fistLetter)) {
			groups = [...groups, { name: fistLetter, books: [book] }];
		} else {
			groups = groups.map((item) =>
				item.name === fistLetter
					? { ...item, books: [...item.books, book] }
					: item
			);
		}
	}

	/* Sort */
	groups.sort((a, b) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();

		if (nameA < nameB) return -1;

		if (nameA > nameB) return 1;

		return 0;
	});

	return groups;
});
</script>

<template>
	<k-block-title>Library</k-block-title>

	<k-list strong-ios outline-ios>
		<k-list-item v-if="getGroups.length === 0" :title="'Not Found'" />

		<k-list-group :key="group.name" v-for="group in getGroups">
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
				:percent="book.percent"
				:img="book.img"
				:metadata="book.metadata"
			></BookItem>
		</k-list-group>
	</k-list>
</template>
