<script setup lang="ts">
import { kButton, kListItem } from 'konsta/vue';
import { ref } from 'vue';
import { IconClipboardCopy, IconShare, IconTrash } from '@tabler/icons-vue';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';

const props = defineProps({
	id: String,
	author: String,
	bookTitle: String,
	title: String,
	cfiRange: String,
	text: String,
	fullText: String,
	toChapter: Function,
	removeSelection: Function,
	backdropClick: Function,
});

const openPopover = ref(false);

const handleContextMenu = (ev: MouseEvent) => {
	ev.preventDefault();
	openPopover.value = true;
};

const handleCopyToClipboard = () => {
	Clipboard.write({
		string: `"${props.fullText}" - ${props.bookTitle}, ${props.author}`,
	});
};

const handleShare = () => {
	Share.share({
		text: `"${props.fullText}" - ${props.bookTitle}, ${props.author}`,
	});
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
		<kButton @click="handleCopyToClipboard" inline clear
			><IconClipboardCopy></IconClipboardCopy>
		</kButton>

		<kButton @click="handleShare" inline clear
			><IconShare></IconShare>
		</kButton>
		<kButton
			inline
			tonal
			@click="() => removeSelection!(cfiRange,id)"
			class="my-auto ml-auto"
			><IconTrash></IconTrash>
		</kButton>
	</div>
</template>
