<script setup lang="ts">
import { computed } from 'vue';
import { Book } from '../stores/AppStore';
import BookItem from './BookItem.vue';
import { f7List, f7ListItem, f7ListGroup, f7BlockTitle } from 'framework7-vue';

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
	<f7BlockTitle>Library</f7BlockTitle>

	<f7List media-list strong-ios outline-ios>
		<f7ListItem v-if="getGroups.length === 0" title="Not Found" />

		<template :key="group.name" v-for="group in getGroups">
			<f7ListItem :title="group.name" group-title />

			<f7ListGroup class="my-2">
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
			</f7ListGroup>
		</template>
	</f7List>
</template>
