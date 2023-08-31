<script setup lang="ts">
import { kButton, kListItem } from 'konsta/vue';
import { ref } from 'vue';
import { IconClipboardCopy, IconShare, IconTrash } from '@tabler/icons-vue';

defineProps({
	id: String,
	title: String,
	cfiRange: String,
	text: String,
	toChapter: Function,
	removeSelection: Function,
	backdropClick: Function,
});

const openPopover = ref(false);

const handleContextMenu = (ev: MouseEvent) => {
	ev.preventDefault();
	openPopover.value = true;
};
</script>

<template>
	<k-list-item
		:title="title"
		:subtitle="text?.length! > 240 ? text?.slice(0, 237) + '...' : text"
		@click="toChapter!(cfiRange)"
		@contextmenu="handleContextMenu"
		link
	>
	</k-list-item>

	<div class="mx-2 my-2 flex">
		<kButton inline clear><IconClipboardCopy></IconClipboardCopy> </kButton>

		<kButton inline clear><IconShare></IconShare> </kButton>
		<kButton
			inline
			tonal
			@click="() => removeSelection!(cfiRange,id)"
			class="my-auto ml-auto"
			><IconTrash></IconTrash>
		</kButton>
	</div>
</template>
