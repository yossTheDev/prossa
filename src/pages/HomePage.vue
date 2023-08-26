<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue';
import { IconBooks, IconPlus, IconClock } from '@tabler/icons-vue';
import { kChip, kFab, kToast, kBlockTitle, kBlock, kNavbar } from 'konsta/vue';
import { Book } from 'epubjs';
import { DateTime, Duration } from 'luxon';
import { ref } from 'vue';
import { Base64Binary } from '../../src/utilities/base';
import BookList from '../components/BookList.vue';
import DaysOfReading from '../components/DaysOfReading.vue';
import AboutModal from '../components/AboutModal.vue';
import SpinnerItem from '../components/SpinnerItem.vue';
import { useAppStore } from '../stores/AppStore';

const store = useAppStore();

const visible = ref(false);
const loading = ref(false);
const showModal = ref(false);
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
				readerImage.onloadend = function () {
					// Add Book
					store.addBook({
						key: newBook.key(), // book unique identifier
						img: JSON.stringify(readerImage.result) || '', // Image as Data Url
						book: reader.result, // Book as Base64 String
						metadata: meta, // Book Metadata
						currentCfi: '',
						percent: '0',
						added: DateTime.now().toISO() as unknown as string,
					});
				};
			} else {
				message.value = 'This book is already in the library';

				const interval = setInterval(() => {
					message.value = '';

					clearInterval(interval);
				}, 2000);
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
</script>

<template>
	<!--Nab Bar-->
	<k-navbar title="Prossa" class="sticky top-0 md:hidden" :large="true">
	</k-navbar>

	<!-- Content -->
	<div
		class="flex h-fit flex-auto flex-col bg-md-light-surface dark:bg-md-dark-surface md:overflow-hidden lg:flex-row"
	>
		<!-- Current Book -->
		<div
			class="mt-2 flex max-h-40 flex-auto flex-col gap-2 overflow-hidden p-4 md:mt-0 lg:h-full lg:max-h-full lg:w-1/3"
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
						<p class="font-bold md:text-xl">
							{{ store.getBook(store.currentBook)?.metadata.title }}
						</p>
						<p class="text-xs">
							{{ store.getBook(store.currentBook)?.metadata.creator }}
						</p>

						<p class="mt-2 text-xs">
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

		<!-- Book List -->
		<div
			class="flex flex-auto flex-col gap-1 md:overflow-hidden md:rounded-l-xl md:bg-md-light-surface-1 md:p-2 md:dark:bg-md-dark-surface-1 lg:w-full lg:grow-0"
		>
			<!--Stats-->
			<k-block-title>Stats</k-block-title>
			<k-block strong-ios outline-ios>
				<!-- Stats-->

				<!-- Days Of Reading-->
				<DaysOfReading></DaysOfReading>

				<!-- Reading Time-->
				<k-chip class="m-0.5">
					<template #media>
						<IconClock class="mr-1"></IconClock>
					</template>

					Reading Time: {{ ' ' }}
					{{
						Duration.fromISO(store.readingTimeThisMonth).toHuman({
							listStyle: 'short',
							unitDisplay: 'short',
							maximumFractionDigits: 0,
						})
					}}
				</k-chip>

				<!-- Last Reading Time-->
				<k-chip class="m-0.5">
					<template #media>
						<IconClock class="mr-1"></IconClock>
					</template>
					Last Reading Time: {{ ' ' }}
					{{ DateTime.fromISO(store.lastReadingTime).toRelative() }}
				</k-chip>
			</k-block>

			<!-- Book List -->
			<div
				id="book_list"
				v-if="store.books.length > 0"
				class="-mt-8 flex flex-auto flex-col md:overflow-auto"
			>
				<BookList></BookList>
			</div>

			<!-- Empty State -->
			<div class="mx-auto my-auto text-gray-400" v-else>
				<div class="">
					<IconBooks :size="84" class="mx-auto"></IconBooks>
					<p class="mx-auto text-center">No Books</p>
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

	<!--About Modal-->
	<div
		@click="showModal = false"
		v-if="showModal"
		class="absolute z-50 flex h-screen w-screen flex-auto bg-black/80"
	>
		<AboutModal></AboutModal>
	</div>

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
</template>
