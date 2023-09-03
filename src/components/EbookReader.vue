<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue';
import {
	IconArrowLeft,
	IconArrowRight,
	IconChevronUp,
	IconHighlight,
} from '@tabler/icons-vue';
import { useDark } from '@vueuse/core';
import { Book, Contents, Rendition } from 'epubjs';
import {
	f7,
	f7Fab,
	f7Link,
	f7Navbar,
	f7Page,
	f7Popup,
	f7Preloader,
	f7Subnavbar,
	f7Tab,
	f7Tabs,
	f7Toolbar,
} from 'framework7-vue';
import { kButton, kList, kListItem, kTabbar, kTabbarLink } from 'konsta/vue';
import localforage from 'localforage';
import { onMounted, onUnmounted, ref } from 'vue';
import { Book as StoredBook, useAppStore } from '../stores/AppStore';
import { Base64Binary } from '../utilities/base';
import AnnotationItem from './AnnotationItem.vue';

const props = defineProps<{
	id: string;
}>();

/* App Store */
const store = useAppStore();

/* Component State */
const isDark = useDark();
const showHighlightsCreator = ref(false);
const currentCfiRange = ref(''); // Used for Highlights
const showControls = ref(true);
const currentPos = ref(0);
const isReady = ref(false);
const tab = ref<'Contents' | 'Highlights'>('Contents');
let book: Book | null = null;
let rendition: Rendition;
let contents: Contents;
let StoreBook: StoredBook | undefined;

/* Chapters */
const chapters = ref();

const setRenderSelection = (cfiRange: string, content: Contents) => {
	showHighlightsCreator.value = true;
	showControls.value = false;
	currentCfiRange.value = cfiRange;
	contents = content;
};

const createHighlight = (color: string) => {
	store.addBookHighlight(
		props.id,
		color,
		currentCfiRange.value,
		rendition.location.start.href,
		rendition.getRange(currentCfiRange.value).toString(),
		getLabel(book?.navigation.toc, rendition.location.start.href)
	);

	console.log(
		'label ' + getLabel(book?.navigation.toc, rendition.location.start.href)
	);

	rendition.annotations.add(
		'highlight',
		currentCfiRange.value,
		{},
		undefined,
		'hl',
		{
			fill: color,
			'fill-opacity': '0.5',
			'mix-blend-mode': 'multiply',
		}
	);
	contents.window.getSelection()?.removeAllRanges();
	showHighlightsCreator.value = false;
};

const removeSelection = (cfiRange: string, id: string) => {
	rendition.annotations.remove(cfiRange, 'highlight');
	store.removeBookHighlight(props.id, id);
};

const getLabel = (toc: any, href: any) => {
	let label = 'n/a';

	// eslint-disable-next-line array-callback-return
	toc.some((item: any) => {
		if (item.subitems.length > 0) {
			const subChapter = getLabel(item.subitems, href);

			if (subChapter !== 'n/a') {
				label = subChapter;
				return true;
			}
		} else if (item.href.includes(href)) {
			label = item.label;
			return true;
		}
	});

	return label;
};

/* Prepare and Load Ebook */
onMounted(async () => {
	StoreBook = store.getBook(props.id);
	const _book = await localforage.getItem(props.id);

	book = new Book(
		Base64Binary.decodeArrayBuffer(
			(_book as any).replace('data:application/epub+zip;base64', '')
		) as unknown as string
	);

	/* Render Ebook */
	rendition = book.renderTo('epub', {
		flow: 'paginated',
		manager: 'continuous',
		spread: 'always',
		snap: true,
		resizeOnOrientationChange: true,
		width: '100%',
		height: '100%',
	});

	/* Change p element z-index */
	book.rendition.themes.default({
		p: { 'z-index': 20 },
		'::selection': { background: 'orange' },
	});

	/* Change Book Text Color Based On Theme */
	if (isDark) {
		book?.rendition.themes.default({ body: { color: '#78817d' } });
	}

	let displayed;

	/* Load book at the begin or at the last user position */
	const currentBook = store.getBook(props.id);
	currentBook && currentBook.currentCfi !== ''
		? (displayed = rendition.display(currentBook.currentCfi))
		: (displayed = rendition.display());

	/* Load Annotations */
	rendition.on('selected', setRenderSelection);
	if (currentBook?.selections) {
		for (const annotation of currentBook.selections) {
			rendition.annotations.add(
				'highlight',
				annotation.cfiRange,
				{},
				undefined,
				'hl',
				{
					fill: annotation.color ?? 'red',
					'fill-opacity': '0.5',
					'mix-blend-mode': 'multiply',
				}
			);
		}
	}

	/* Add Click Events to Rendition */
	rendition.on('rendered', (_e: any, i: any) => {
		i.document.documentElement.addEventListener('click', () => {
			showControls.value = !showControls.value;
			showHighlightsCreator.value = false;
		});

		i.document.documentElement.addEventListener(
			'contextmenu',
			(ev: MouseEvent) => {
				ev.preventDefault();
			}
		);
	});

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
	rendition.off('selected', setRenderSelection);
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
		<div class="absolute mt-4 ml-2 flex flex-auto">
			<div class="flex">
				<kButton @click="f7.views.main.router.back()" clear
					><IconArrowLeft></IconArrowLeft
				></kButton>
			</div>
		</div>
	</TransitionRoot>

	<!-- Virtual Controls-->
	<div class="absolute z-10 hidden h-full w-full flex-row">
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
				class="mx-auto flex w-56 flex-auto select-none flex-col overflow-hidden md:w-72"
			>
				<div
					class="dark:bg-base-200/80 z-20 my-auto mx-6 flex flex-auto rounded-2xl bg-md-light-surface-2 px-2 py-1 shadow dark:bg-md-dark-surface-2 md:mx-2"
				>
					<div class="flex flex-auto gap-1">
						<!-- Arrow Back -->
						<kButton clear @click="back">
							<IconArrowLeft></IconArrowLeft>
						</kButton>

						<!-- Percent -->
						<p class="my-auto mx-auto">{{ currentPos + '%' }}</p>

						<!-- Arrow Next -->
						<kButton clear @click="next">
							<IconArrowRight></IconArrowRight>
						</kButton>
					</div>
				</div>
			</div>

			<f7Fab v-if="isReady" @click="() => f7.popup.open('.menu_popup')"
				><IconChevronUp></IconChevronUp>
			</f7Fab>
		</TransitionRoot>
	</div>

	<!--Highlight Creator-->
	<div
		v-if="showHighlightsCreator"
		class="pointer-events-none absolute z-50 flex h-full w-full"
	>
		<div
			class="pointer-events-auto mt-4 ml-2 flex h-fit flex-col gap-2 rounded-2xl bg-md-light-surface-1 p-2 dark:bg-md-dark-surface-1"
		>
			<IconHighlight class="mx-auto mb-2"></IconHighlight>
			<button
				@click="() => createHighlight('#2682DC')"
				class="h-6 w-6 rounded-2xl bg-[#2682DC]"
			></button>

			<button
				@click="() => createHighlight('#C6292C')"
				class="h-6 w-6 rounded-2xl bg-[#C6292C]"
			></button>

			<button
				@click="() => createHighlight('#EBFF38')"
				class="h-6 w-6 rounded-2xl bg-[#EBFF38]"
			></button>

			<button
				@click="() => createHighlight('#5BFF3E')"
				class="h-6 w-6 rounded-2xl bg-[#5BFF3E]"
			></button>
		</div>
	</div>

	<!--Loading-->
	<TransitionRoot
		enter="transition-opacity duration-75"
		enter-from="opacity-0"
		enter-to="opacity-100"
		leave="transition-opacity duration-150"
		leave-from="opacity-100"
		leave-to="opacity-0"
		:show="!isReady"
	>
		<div
			class="absolute z-[99] flex h-full w-full bg-md-light-surface dark:bg-md-dark-surface"
		>
			<div class="my-auto mx-auto flex flex-col text-center">
				<p class="text-xl">Processing Book</p>
				<p class="mb-4">It may take a while the fist time</p>
				<f7Preloader class="mx-auto"></f7Preloader>
			</div>
		</div>
	</TransitionRoot>

	<!--Menu-->
	<f7Popup
		@popup:closed="() => f7.statusbar.hide()"
		@popup:opened="() => f7.statusbar.show()"
		close-on-escape
		class="menu_popup"
	>
		<f7Page :page-content="false">
			<f7Navbar
				:subtitle="store.getBook(id)?.metadata?.creator!"
				:title="store.getBook(id)?.metadata?.title?.length! > 30 ? store.getBook(id)?.metadata?.title?.slice(0,27) + '...' : store.getBook(id)?.metadata?.title!"
			>
				<template #right>
					<div class="fixed right-0 mr-2 cursor-pointer select-none">
						<f7Link toolbar popup-close>Close</f7Link>
					</div>
				</template>

				<f7Subnavbar>
					<kTabbar>
						<kTabbarLink
							:active="tab === 'Contents'"
							@click="tab = 'Contents'"
							label="Chapters"
						></kTabbarLink>
						<kTabbarLink
							:active="tab === 'Highlights'"
							@click="tab = 'Highlights'"
							label="Highlights"
						></kTabbarLink>
					</kTabbar>
				</f7Subnavbar>
			</f7Navbar>

			<f7Toolbar tabbar bottom>
				<f7Link tab-link="#contents">Chapters</f7Link>
				<f7Link tab-link="#highlights">Highlights</f7Link>
			</f7Toolbar>

			<f7Tabs swipeable>
				<f7Tab class="page-content" id="contents">
					<k-list class="flex w-full flex-col">
						<k-list-item
							:title="item.label"
							@click="toChapter(item.href)"
							:key="item.id"
							link
							v-for="item in chapters"
							class="hover:bg-neutral rounded-xl p-1"
						></k-list-item>
					</k-list>
				</f7Tab>

				<f7Tab class="page-content" id="highlights">
					<k-list class="flex w-full flex-col px-1">
						<k-list-item
							v-if="
								!store.getBook(id)?.selections ||
								store.getBook(id)?.selections?.length === 0
							"
							:title="'You have not made any entries yet'"
						/>

						<AnnotationItem
							v-for="selection in store.getBook(id)?.selections"
							:to-chapter="toChapter"
							:cfi-range="selection.cfiRange"
							:remove-selection="removeSelection"
							:author="StoreBook?.metadata.creator"
							:book-title="StoreBook?.metadata.title"
							:id="selection.id"
							:title="selection.label"
							:key="selection.id"
							:full-text="selection.text"
							:text="
								selection.text.length > 240
									? selection.text.slice(0, 237) + '...'
									: selection.text
							"
						>
						</AnnotationItem>
					</k-list>
				</f7Tab>
			</f7Tabs>
		</f7Page>
	</f7Popup>

	<!-- Content -->
	<div class="flex h-full w-full flex-auto flex-col">
		<!-- Epub -->
		<div class="flex h-full w-full flex-auto" id="epub"></div>
	</div>
</template>
