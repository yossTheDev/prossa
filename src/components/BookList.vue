<script setup lang="ts">
import { useAppStore } from '../stores/AppStore';
import BookItem from './BookItem.vue';

/* App Store */
const store = useAppStore();
</script>

<template>
	<div :key="book.key" v-for="book in store.books">
		<BookItem
			:book-key="book.key"
			:creator="book.metadata.creator"
			:description="book.metadata.description"
			:title="book.metadata.title"
			:img="book.img"
		></BookItem>
	</div>
</template>
