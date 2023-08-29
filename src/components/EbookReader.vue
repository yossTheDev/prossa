<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue';
import { IconArrowLeft, IconArrowRight, IconBook2 } from '@tabler/icons-vue';
import { useDark } from '@vueuse/core';
import { Book } from 'epubjs';
import {
	kBlockTitle,
	kList,
	kListItem,
	kPage,
	kPanel,
	kPreloader,
} from 'konsta/vue';
import localforage from 'localforage';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from '../stores/AppStore';
import { Base64Binary } from '../utilities/base';

const props = defineProps<{
	id: string;
}>();

/* Component State */
const showControls = ref(true);
const currentPos = ref(0);
const isReady = ref(false);

/* App Store */
const store = useAppStore();

/* Chapters */
const chapters = ref();

/* Component State */
const showChapters = ref(false);
let book: Book | null = null;

const isDark = useDark();

/* Prepare and Load Ebook */
onMounted(async () => {
	const _book = await localforage.getItem(props.id);

	book = new Book(
		Base64Binary.decodeArrayBuffer(
			(_book as any).replace('data:application/epub+zip;base64', '')
		) as unknown as string
	);

	/* Render Ebook */
	const rendition = book.renderTo('epub', {
		flow: 'paginated',
		manager: 'continuous',
		spread: 'always',
		snap: true,
		resizeOnOrientationChange: true,
		width: '100%',
		height: '100%',
	});

	/* Change p element z-index */
	book.rendition.themes.default({ p: { 'z-index': 20 } });

	/* Load book at the begin or at the last user position */
	const getBook = store.getBook(props.id);

	/* Change Book Text Color Based On Theme */
	if (isDark) {
		book?.rendition.themes.default({ body: { color: '#78817d' } });
	}

	let displayed;

	getBook && getBook.currentCfi !== ''
		? (displayed = rendition.display(getBook.currentCfi))
		: (displayed = rendition.display());

	/* On Book Display */
	displayed.then(() => {
		/* Get Current Location */
		const current = book?.rendition.currentLocation();

		/* Start Index */
		const { start } = current as unknown as any;

		/* Get Actual Book Completion Percent */
		const percentage = book?.locations.percentageFromCfi(start.cfi);

		/* Set Current Position */
		if (percentage) currentPos.value = Math.floor(percentage * 100);

		chapters.value = book?.navigation.toc;
	});

	/* On Book Ready */
	book.ready.then(async () => {
		/* Load or Generate Locations */
		const loc = await localforage.getItem(`${book?.key()}-locations`);
		if (loc !== null) {
			book?.locations.load(loc as unknown as string);
			isReady.value = true;
		} else {
			book?.locations.generate(1024).then(async (locations) => {
				await localforage.setItem(`${book?.key()}-locations`, locations);
				isReady.value = true;
			});
		}
	});

	/* On Relocated */
	rendition.on('relocated', (locations: any) => {
		const progress = book?.locations.percentageFromCfi(locations.start.cfi);

		/* Set Current Position */
		if (progress) currentPos.value = Math.floor(progress * 100);

		/* Save Current Pos */
		if (progress)
			store.setBookCFI(props.id, locations.start.cfi, progress?.toString());

		// console.log('Progress: ' + progress);
		/* console.log(
			'Current Page: ' + book?.locations.locationFromCfi(locations.start.cfi)
		); */
		/* console.log('Total Page: ' + book?.locations.length()); */
	});
});

/* Destroy Book Instance */
onUnmounted(() => {
	book?.destroy();
});

/* Functions */

/* Next page */
async function next() {
	/* Go To Next Page */
	await book?.rendition.next();
}

/* Back page */
async function back() {
	/* Go To Previous Page */
	await book?.rendition.prev();
}

/* Go To Chapter */
async function toChapter(href: string) {
	/* Render Specific Page */
	await book?.rendition.display(href);
}

/* Toggle Controls */
function toggleControls() {
	showControls.value = !showControls.value;
	console.log(showControls);
}

/* Show Chapters Panel */
function toggleChapters() {
	showChapters.value = !showChapters.value;
}
</script>

<template>
	<!--Nav Bar-->
	<TransitionRoot
		:show="showControls"
		enter="transition-opacity duration-75"
		enter-from="opacity-0"
		enter-to="opacity-100"
		leave="transition-opacity duration-150"
		leave-from="opacity-100"
		leave-to="opacity-0"
		class="z-20"
	>
		<div class="absolute flex max-h-9 flex-auto text-gray-400">
			<div class="my-auto flex flex-auto p-2">
				<div class="my-auto flex w-1/3">
					<router-link
						class="rounded-full p-2 hover:bg-base-dark-light/20"
						to="/"
						><IconArrowLeft class="mx-auto my-auto h-6"></IconArrowLeft
					></router-link>
				</div>

				<div class="my-auto flex w-1/3"></div>

				<div class="my-auto flex w-1/3"></div>
			</div>
		</div>
	</TransitionRoot>

	<!-- Virtual Controls-->
	<div class="absolute z-10 flex h-full w-full flex-row">
		<div @click="back" class="flex flex-auto"></div>
		<div @click="toggleControls" class="flex flex-auto"></div>
		<div @click="next" class="flex flex-auto"></div>
	</div>

	<!-- Controls Panel -->
	<div class="absolute flex h-full w-full flex-auto">
		<TransitionRoot
			class="mx-auto mt-auto mb-4 flex h-fit"
			:show="showControls"
			enter="transition-opacity duration-75"
			enter-from="opacity-0"
			enter-to="opacity-100"
			leave="transition-opacity duration-150"
			leave-from="opacity-100"
			leave-to="opacity-0"
		>
			<!-- Controls -->
			<div
				class="mx-auto flex w-80 flex-auto select-none flex-col overflow-auto"
			>
				<div
					class="dark:bg-base-200/80 z-20 my-auto mx-6 flex flex-auto overflow-auto rounded-xl bg-md-light-surface-1 p-1 shadow dark:bg-md-dark-surface-2 md:mx-2"
				>
					<div class="flex w-1/3 flex-auto">
						<!-- Arrow Back -->
						<div
							class="hover:bg-neutral my-auto cursor-pointer select-none rounded-xl p-2"
							@click="back"
						>
							<IconArrowLeft></IconArrowLeft>
						</div>

						<!-- Arrow Next -->
						<div
							class="hover:bg-neutral my-auto cursor-pointer select-none rounded-xl p-2"
							@click="next"
						>
							<IconArrowRight></IconArrowRight>
						</div>
					</div>

					<div class="flex w-1/3 flex-auto">
						<!-- Percent -->
						<p class="my-auto mx-auto">{{ currentPos + '%' }}</p>
					</div>

					<div class="flex w-1/3 flex-auto items-end">
						<!-- Chapters -->
						<div
							@click="toggleChapters"
							class="hover:bg-neutral my-auto ml-auto flex rounded-xl p-2 transition-all active:scale-90"
						>
							<IconBook2></IconBook2>
						</div>
					</div>
				</div>
			</div>
		</TransitionRoot>
	</div>

	<!-- Chapters Panel -->
	<k-panel
		side="left"
		floating
		:opened="showChapters"
		@backdropclick="() => (showChapters = false)"
	>
		<k-page class="flex h-full flex-col overflow-hidden">
			<k-block-title>Chapters</k-block-title>
			<k-list class="flex h-full flex-col overflow-auto">
				<k-list-item
					:title="item.label"
					@click="toChapter(item.href)"
					:key="item.id"
					link
					v-for="item in chapters"
					class="hover:bg-neutral rounded-xl p-1"
				></k-list-item>
			</k-list>
		</k-page>
	</k-panel>

	<!--Loading-->
	<TransitionRoot
		enter="transition-opacity duration-75"
		enter-from="opacity-0"
		enter-to="opacity-100"
		leave="transition-opacity duration-150"
		leave-from="opacity-100"
		leave-to="opacity-0"
		:show="!isReady"
		class="z-50"
	>
		<div class="absolute z-50 flex h-full w-full bg-md-dark-surface">
			<div class="my-auto mx-auto flex flex-col text-center">
				<p class="text-xl">Processing Book</p>
				<p>It may take a while the fist time</p>
				<kPreloader size="w-16 h-16 mx-auto"></kPreloader>
			</div>
		</div>
	</TransitionRoot>

	<!-- Content -->
	<div class="flex h-full w-full flex-auto flex-col">
		<!-- Epub -->
		<div class="flex h-full w-full flex-auto" id="epub"></div>
	</div>
</template>
