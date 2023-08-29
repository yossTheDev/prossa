<script setup lang="ts">
import { StatusBar } from '@capacitor/status-bar';
import { TransitionRoot } from '@headlessui/vue';
import {
	IconBooks,
	IconFlame,
	IconMenu2,
	IconPlus,
	IconSearch,
} from '@tabler/icons-vue';
import { Book } from 'epubjs';
import {
	kBlock,
	kBlockTitle,
	kButton,
	kFab,
	kLink,
	kList,
	kListItem,
	kNavbar,
	kPage,
	kPopup,
	kSearchbar,
	kToast,
} from 'konsta/vue';
import localforage from 'localforage';
import { DateTime } from 'luxon';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Base64Binary } from '../../src/utilities/base';
import BookItem from '../components/BookItem.vue';
import BookList from '../components/BookList.vue';
import StatsPopup from '../components/Popups/StatsPopup.vue';
import SpinnerItem from '../components/SpinnerItem.vue';
import { useAppStore } from '../stores/AppStore';
import { KeepAwake } from '@capacitor-community/keep-awake';

const store = useAppStore();
const router = useRouter();

const visible = ref(false);
const loading = ref(false);

const query = ref('');
const message = ref('');

function handleAddBook(event: any) {
	if (event.target.files && event.target.files.length > 0) {
		// Initialize File Reader
		const reader = new FileReader();

		/* Show Global Spinner */
		loading.value = true;

		// Load and Extract Data for the New Book
		reader.addEventListener('load', async () => {
			/* Decode Base64 string into Array Buffer and load as Epub */
			const newBook = new Book(
				Base64Binary.decodeArrayBuffer(
					(reader.result as unknown as string).replace(
						'data:application/epub+zip;base64',
						''
					)
				) as unknown as string
			);

			// Get Cover Image URl
			const coverURl = await newBook.coverUrl();

			// Get Cover Image Blob
			const response = await fetch(coverURl || '');
			const image = await response.blob();

			/* Verify if this book not exists in Store */
			if (!store.books.find((el) => el.key === newBook.key())) {
				/* Get Ebook Metadata */
				const meta = await newBook.loaded.metadata;

				/* Load Cover Image as Data Url */
				const readerImage = new FileReader();
				readerImage.readAsDataURL(image);

				/* And Save the New Book to the Store */
				readerImage.onloadend = async function () {
					// Add Book
					store.addBook({
						key: newBook.key(), // book unique identifier
						img: JSON.stringify(readerImage.result) || '', // Image as Data Url
						metadata: meta, // Book Metadata
						currentCfi: '',
						percent: '0',
						added: DateTime.now().toISO() as unknown as string,
					});

					/* Save Book on IndexedDB */
					await localforage.setItem(
						newBook.key(),
						reader.result as unknown as string
					);

					/* Show Toast Message */
					message.value = 'The book has been added to the library';
				};
			} else {
				message.value = 'This book is already in the library';
			}
		});

		/* Read */
		reader.readAsDataURL(event.target.files[0]);

		/* Hide Global Spinner */
		loading.value = false;
	}
}

function onClosing() {
	visible.value = !visible.value;
}

const handleCloseSearchModal = () => {
	router.replace('/');
	query.value = '';
};

watch(message, () => {
	if (message.value !== '') {
		const interval = setInterval(() => {
			message.value = '';

			clearInterval(interval);
		}, 2000);
	}
});

/* Show Status Bar */
onMounted(() => {
	StatusBar.show();
	StatusBar.setOverlaysWebView({ overlay: false });

	/* Disable Keep Awake */
	KeepAwake.allowSleep();
});
</script>

<template>
	<k-page
		:colors="{
			bgMaterial: 'bg-md-light-surface-2 dark:bg-md-dark-surface-2',
		}"
		class="relative flex flex-col"
	>
		<!--Nab Bar-->
		<k-navbar class="sticky top-0 md:hidden" large>
			<template #left>
				<kLink
					@click="() => $router.push({ name: '/', params: { menu: 'menu' } })"
					navbar
					><IconMenu2></IconMenu2
				></kLink>
			</template>

			<template #right>
				<div class="fixed right-0 mr-1 flex">
					<kButton
						@click="
							() => $router.push({ name: '/', params: { stats: 'stats' } })
						"
						rounded
						tonal-material
						small
					>
						<IconFlame></IconFlame> {{ store.daysOfReading }}</kButton
					>
					<kLink
						class="mt-1"
						@click="
							() => $router.push({ name: '/', params: { search: 'search' } })
						"
						navbar
						><IconSearch></IconSearch
					></kLink>
				</div>
			</template>

			<template #title>
				<!-- Current Book -->
				<div class="-mt-1 flex max-h-28 flex-auto flex-col overflow-hidden">
					<!-- Book Hero -->
					<div class="mb-8 flex flex-auto select-none flex-row gap-2">
						<img
							class="my-auto flex h-24 rounded shadow"
							v-if="store.currentBook !== ''"
							:src="JSON.parse(store.getBook(store.currentBook)?.img as unknown as string)"
						/>
						<div
							v-if="store.currentBook !== ''"
							class="my-auto flex flex-auto flex-col gap-1 overflow-hidden text-md-dark-surface-2 dark:text-md-light-surface-2"
						>
							<div class="my-auto flex flex-col">
								<p class="max-w-[16rem] overflow-hidden text-lg font-bold">
									{{ store.getBook(store.currentBook)?.metadata.title }}
								</p>
								<p class="text-xs">
									{{ store.getBook(store.currentBook)?.metadata.creator }}
								</p>
							</div>
						</div>

						<p class="mx-auto my-auto text-center text-gray-500" v-else>
							Lets read a book
						</p>
					</div>
				</div>
			</template>

			<template #subtitle>
				<div v-if="store.currentBook !== ''" class="mt-16 flex h-40 w-full">
					<p class="-mt-[1.31rem] text-2xl">Prossa</p>
				</div>

				<div v-else class="mt-24 flex h-40 w-full">
					<p class="-mt-3 text-2xl">Prossa</p>
				</div>
			</template>
		</k-navbar>

		<!-- Search Popup-->
		<kPopup
			@backdropclick="handleCloseSearchModal"
			:opened="$route.params.search === 'search'"
		>
			<kPage>
				<kNavbar large title="Search">
					<template #right>
						<div class="fixed right-0 mr-1">
							<kLink @click="handleCloseSearchModal" navbar>Cancel</kLink>
						</div></template
					>
				</kNavbar>

				<kBlock>
					<div
						class="flex max-h-12 w-full rounded-full bg-md-light-surface-3 px-3 dark:bg-md-dark-surface-1"
					>
						<div class="ml-2 flex w-full">
							<kSearchbar
								@input="(ev) => (query = ev.currentTarget.value)"
								:value="query"
								:clear-button="false"
								:colors="{
									inputBgMaterial:
										'dark:bg-md-dark-surface-1 bg-md-light-surface-3',
								}"
								input-style="padding-left: 2rem"
							></kSearchbar>
						</div>
					</div>
				</kBlock>

				<kBlockTitle>Books</kBlockTitle>

				<kList>
					<kListItem
						v-if="
							store.books.filter(
								(book) =>
									book.metadata.title
										.toUpperCase()
										.indexOf(query.toUpperCase()) > -1
							).length === 0
						"
						title="Not Found"
					></kListItem>
					<BookItem
						:key="book.key"
						v-for="book in store.books.filter(
							(book) =>
								book.metadata.title.toUpperCase().indexOf(query.toUpperCase()) >
								-1
						)"
						:book-key="book.key"
						:creator="book.metadata.creator"
						:description="book.metadata.description"
						:title="book.metadata.title"
						:img="book.img"
					></BookItem>
				</kList>
			</kPage>
		</kPopup>

		<!-- Stats Popup-->
		<StatsPopup></StatsPopup>

		<!-- Content -->
		<div
			class="flex h-fit flex-auto flex-col rounded-t-2xl bg-md-light-surface shadow-2xl dark:bg-md-dark-surface-1 md:overflow-hidden md:rounded-none md:shadow-none md:dark:bg-md-dark-surface lg:flex-row"
		>
			<!-- Current Book -->
			<div
				class="hidden max-h-40 flex-auto flex-col gap-2 overflow-hidden p-4 md:mt-0 md:flex lg:h-full lg:max-h-full lg:w-1/3"
			>
				<!-- Book Hero -->
				<div class="flex flex-auto select-none flex-row gap-2">
					<img
						class="my-auto h-36 rounded md:h-60"
						v-if="store.currentBook !== ''"
						:src="JSON.parse(store.getBook(store.currentBook)?.img as unknown as string)"
					/>
					<div
						v-if="store.currentBook !== ''"
						class="flex flex-auto flex-col gap-1"
					>
						<div class="my-auto">
							<p class="text-xl font-bold">
								{{ store.getBook(store.currentBook)?.metadata.title }}
							</p>
							<p class="text md:text-xs">
								{{ store.getBook(store.currentBook)?.metadata.creator }}
							</p>

							<p class="mt-2 hidden text-xs">
								{{
									Math.round(
										(store.getBook(store.currentBook)
											?.percent as unknown as number) * 100
									)
								}}

								% - Complete
							</p>
						</div>
					</div>

					<p class="mx-auto my-auto text-center text-gray-500" v-else>
						Lets read a book
					</p>
				</div>

				<!-- Book Description -->
				<div
					v-if="store.currentBook !== ''"
					class="hidden flex-auto select-none overflow-auto lg:flex"
				>
					<span
						v-html="store.getBook(store.currentBook)?.metadata.description"
						class="text-xs text-gray-500"
					>
					</span>
				</div>
			</div>

			<!-- Book List and Stats -->
			<div
				class="flex flex-auto flex-col gap-0 md:overflow-hidden lg:w-full lg:grow-0"
			>
				<!-- Search Bar -->
				<kBlock class="hidden gap-2 md:flex">
					<div
						class="flex max-h-14 w-full gap-2 rounded-full bg-md-light-surface-3 px-3 dark:bg-md-dark-surface-1"
					>
						<div class="ml-2 flex w-full">
							<kSearchbar
								@input="(ev) => (query = ev.currentTarget.value)"
								:value="query"
								:clear-button="false"
								:colors="{
									inputBgMaterial:
										'dark:bg-md-dark-surface-1 bg-md-light-surface-3',
								}"
								input-style="padding-left: 2rem"
							></kSearchbar>
						</div>
					</div>

					<!--Stats Button-->
					<kButton
						@click="
							() => $router.push({ name: '/', params: { stats: 'stats' } })
						"
						class="my-auto ml-auto max-w-[6rem]"
						rounded
						tonal-material
					>
						<IconFlame></IconFlame> {{ store.daysOfReading }}</kButton
					>
				</kBlock>

				<!-- Book List -->
				<div
					class="flex h-full flex-col md:overflow-auto md:rounded-tl-2xl md:bg-md-light-surface-1 md:py-1 md:shadow-xl md:dark:bg-md-dark-surface-1"
				>
					<!-- Book List -->
					<BookList
						:books="
							computed(() =>
								store.books.filter(
									(book) =>
										book.metadata.title
											.toUpperCase()
											.indexOf(query.toUpperCase()) > -1
								)
							).value
						"
						v-if="store.books.length > 0"
					></BookList>

					<!-- Empty State -->
					<div class="mx-auto my-auto flex h-full text-gray-400" v-else>
						<div class="my-auto">
							<IconBooks :size="84" class="mx-auto"></IconBooks>
							<p class="mx-auto text-center">No Books</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--Global Spinner-->
		<div
			v-if="loading"
			class="absolute z-50 flex h-screen w-screen flex-auto bg-black/80"
		>
			<SpinnerItem class="fill-white"></SpinnerItem>
		</div>

		<!-- Toast -->
		<k-toast position="center" :opened="message !== ''">
			<template #button> </template>
			<div class="shrink">{{ message }}</div>
		</k-toast>

		<!-- Drawer -->
		<div class="absolute h-full w-full">
			<div
				@click="onClosing"
				v-if="visible"
				class="absolute z-20 flex h-full w-full flex-auto bg-gray-100/5"
			></div>
			<TransitionRoot
				:show="visible"
				enter="duration-150"
				enter-from="-ml-96"
				enter-to="ml-0"
				leave="duration-150"
				leave-from="opacity-100"
				leave-to="-ml-96"
				class="absolute z-20 h-full bg-yellow-300"
			>
				<div
					class="absolute flex h-full w-80 max-w-xs flex-auto bg-white dark:bg-base-dark-light"
				>
					<p>Header</p>
				</div>
			</TransitionRoot>
		</div>

		<!-- FAB -->
		<label for="file-input">
			<k-fab class="fixed z-20 right-4-safe bottom-4-safe">
				<template #icon>
					<IconPlus></IconPlus>
				</template>
			</k-fab>

			<input
				hidden
				accept=".epub"
				@input="handleAddBook"
				type="file"
				id="file-input"
			/>
		</label>
	</k-page>
</template>
