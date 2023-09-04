<script setup lang="ts">
import { kButton } from 'konsta/vue';
import { ref } from 'vue';
import { IconClipboardCopy, IconShare, IconTrash } from '@tabler/icons-vue';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { f7, f7ListItem } from 'framework7-vue';

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
	f7.toast.show({ text: 'copied!', closeTimeout: 2000 });
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
	<f7ListItem
		:title="title"
		:subtitle="text?.length! > 240 ? text?.slice(0, 237) + '...' : text"
		@click="toChapter!(cfiRange)"
		@contextmenu="handleContextMenu"
		link
	>
	</f7ListItem>

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
