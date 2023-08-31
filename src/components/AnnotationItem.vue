<script setup lang="ts">
import { kButton, kList, kListItem, kPopover } from 'konsta/vue';
import { ref } from 'vue';

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
		class="z-50"
		:title="title"
		:subtitle="text?.length! > 240 ? text?.slice(0, 237) + '...' : text"
		@click="toChapter!(cfiRange)"
		@contextmenu="handleContextMenu"
		link
		:class="'popover-' + id"
	>
	</k-list-item>
	<p>{{ title }}</p>
	<kButton
		@click="() => removeSelection!(cfiRange,id)"
		class="mx-auto flex w-48"
		>Remove</kButton
	>

	<Teleport to="#popup-target">
		<kPopover
			@backdropclick="
				() => {
					//backdropClick!()
					openPopover = false;
				}
			"
			:target="'.popover-' + id"
			:opened="openPopover"
		>
			<kList>
				<kListItem title="Delete"></kListItem>
			</kList>
		</kPopover>
	</Teleport>
</template>
