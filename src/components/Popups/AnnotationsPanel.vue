<script setup lang="ts">
import { kBlockTitle, kList, kListItem, kPage, kPanel } from 'konsta/vue';
import { useAppStore } from '../../stores/AppStore';
import AnnotationItem from '../AnnotationItem.vue';

const store = useAppStore();
defineProps({
	bookID: String,
	toChapter: Function,
	removeSelection: Function,
});
</script>

<template>
	<k-panel
		side="right"
		floating
		:opened="$route.params.annotations === 'annotations'"
		@backdropclick="
			() => $router.replace({ name: 'book', params: { id: $route.params.id } })
		"
	>
		<k-page class="flex h-full flex-col overflow-hidden">
			<k-block-title>Highlights</k-block-title>

			<k-list class="flex h-full flex-col gap-2 overflow-auto px-3">
				<k-list-item
					v-if="!store.getBook(bookID!)?.selections || store.getBook(bookID!)?.selections?.length === 0"
					:title="'No highlights yet'"
				/>

				<AnnotationItem
					:to-chapter="toChapter"
					:cfi-range="selection.cfiRange"
					:remove-selection="removeSelection"
					v-for="(selection) in store.getBook(bookID!)?.selections"
					:id="selection.id"
					:title="selection.label"
					:key="selection.id"
					:text="
						selection.text.length > 240
							? selection.text.slice(0, 237) + '...'
							: selection.text
					"
				>
				</AnnotationItem>
			</k-list>
		</k-page>
	</k-panel>
</template>
