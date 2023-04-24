<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue';
import { IconArrowLeft, IconArrowRight, IconLetterA } from '@tabler/icons-vue';
import { useDark } from '@vueuse/core';
import { Book } from 'epubjs';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from '../stores/AppStore';
import { Base64Binary } from '../utilities/base';

const props = defineProps<{
	id: string;
}>();

/* Component State */
const image = ref('');
const showControls = ref(true);
const currentPos = ref(0);

/* App Store */
const store = useAppStore();

const _book = store.getBook(props.id);

/* Load Book */
const book = new Book(
	Base64Binary.decodeArrayBuffer(
		_book?.book.replace('data:application/epub+zip;base64', '')
	) as unknown as string
);

/* Prepare and Load Ebook */
onMounted(async () => {
	/* Render Ebook */
	const rendition = book.renderTo('epub', {
		flow: 'auto',
		snap: true,
		resizeOnOrientationChange: true,
		infinite: true,
		width: '100%',
		height: '100%',
	});

	/* Set Text Color based on Device Color Mode */
	book.rendition.themes.default({ p: { 'z-index': 20 } });
	useDark({
		onChanged: (isDark) => {
			if (isDark) {
				book.rendition.themes.default({ body: { color: '#78817d' } });
			}
		},
	});

	/* Get Cover Image */
	const cover = await book.coverUrl();
	if (cover) image.value = cover;

	/* Store Display Status */
	let displayed;

	/* Load book at the begin or at the last user position */
	const getBook = store.getBook(props.id);

	getBook && getBook.currentCfi !== ''
		? (displayed = rendition.display(getBook.currentCfi))
		: (displayed = rendition.display());

	/* On Book Display */
	displayed.then(() => {
		/* Get Current Location */
		const current = book.rendition.currentLocation();

		/* Start Index */
		const { start } = current as unknown as any;

		/* Get Actual Book Completion Percent */
		const percentage = book.locations.percentageFromCfi(start.cfi);

		/* Set Current Position */
		currentPos.value = Math.floor(percentage * 100);
	});

	/* On Book Ready */
	book.ready.then(() => {
		book.locations.generate(150);
		// book.storage.put(book.resources)
		// console.log('Locations generated');
		// console.log(book.locations);
		// console.log('lenght ' + book.locations.length());
	});
});

/* Destroy Book Instance */
onUnmounted(() => {
	book.destroy();
});

/* Functions */

/* Next page */
async function next() {
	/* Go To Next Page */
	await book.rendition.next();

	/* Get Current Location */
	const current = book.rendition.currentLocation();

	/* Start Index */
	const { start } = current as unknown as any;

	/* Get Actual Book Completion Percent */
	const percentage = book.locations.percentageFromCfi(start.cfi);

	/* Set Current Position */
	currentPos.value = Math.floor(percentage * 100);

	/* Save Current Pos */
	store.setBookCFI(props.id, start.cfi, start.percentage);

	console.log('book id ' + props.id);
	console.log(store.books);
	// console.log(book.locations.percentageFromCfi(start.cfi));
}

/* Back page */
async function back() {
	/* Go To Previous Page */
	await book.rendition.prev();

	/* Get Current Location */
	const current = book.rendition.currentLocation();

	/* Start Index */
	const { start } = current as unknown as any;

	/* Get Actual Book Completion Percent */
	const percentage = book.locations.percentageFromCfi(start.cfi);

	/* Set Current Position */
	currentPos.value = Math.floor(percentage * 100);

	/* Save Current Pos */
	store.setBookCFI(props.id, start.cfi, start.percentage);
}

/* Toggle Controls */
function toggleControls() {
	showControls.value = !showControls.value;
	console.log(showControls);
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
	<div class="absolute z-10 flex h-screen w-full flex-row">
		<div @click="back" class="flex flex-auto"></div>
		<div @click="toggleControls" class="flex flex-auto"></div>
		<div @click="next" class="flex flex-auto"></div>
	</div>

	<!-- Controls Panel -->
	<div class="absolute h-screen w-screen">
		<div class="flex h-full w-full">
			<!-- Controls -->
			<div class="z-20 mt-auto mb-4 flex flex-auto flex-col">
				<TransitionRoot
					:show="showControls"
					enter="transition-opacity duration-75"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="transition-opacity duration-150"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<!-- Controls -->
					<div class="mx-auto flex w-96 flex-auto overflow-auto">
						<div
							class="z-20 my-auto mx-6 flex flex-auto overflow-auto rounded-xl bg-white p-1 text-gray-400 shadow dark:bg-base-dark-light/20 md:mx-2"
						>
							<div class="flex flex-auto">
								<!-- Arrow Back -->
								<div
									class="my-auto cursor-pointer select-none rounded p-2 hover:bg-gray-200/70 dark:hover:bg-base-dark-light"
									@click="back"
								>
									<IconArrowLeft></IconArrowLeft>
								</div>

								<!-- Arrow Next -->
								<div
									class="my-auto cursor-pointer select-none rounded p-2 hover:bg-gray-200/70 dark:hover:bg-base-dark-light"
									@click="next"
								>
									<IconArrowRight></IconArrowRight>
								</div>
							</div>

							<div class="flex flex-auto">
								<!-- Percentage -->
								<p class="my-auto ml-auto">{{ currentPos + '%' }}</p>

								<!-- Setting -->
								<div class="my-auto flex hover:bg-gray-200/70">
									<IconLetterA></IconLetterA>
								</div>
							</div>
						</div>
					</div>
				</TransitionRoot>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="flex h-full w-full flex-auto flex-col">
		<!-- Epub -->
		<div class="flex h-full w-full flex-auto" id="epub"></div>
	</div>
</template>
