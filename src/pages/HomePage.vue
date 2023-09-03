<script setup lang="ts">
import {
	IconBooks,
	IconFlame,
	IconMenu2,
	IconPlus,
	IconSearch,
} from '@tabler/icons-vue';
import {
	f7Button,
	f7Fab,
	f7Link,
	f7Navbar,
	f7Page,
	f7Searchbar,
	f7Subnavbar,
} from 'framework7-vue';
import { kLink } from 'konsta/vue';
import localforage from 'localforage';
import { DateTime } from 'luxon';
import { computed, ref, watch } from 'vue';
import { Base64Binary } from '../../src/utilities/base';
import BookList from '../components/BookList.vue';
import { useAppStore } from '../stores/AppStore';

const store = useAppStore();

const loading = ref(false);

const query = ref('');
const message = ref('');

async function handleAddBook(files: any) {
	if (files && files.length > 0) {
		const { Book } = await import('epubjs');
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
		reader.readAsDataURL(files[0]);

		/* Hide Global Spinner */
		loading.value = false;
	}
}

const pickFile = () => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.epub';
	input.addEventListener('change', () => handleAddBook(input.files));
	input.click();
};

watch(message, () => {
	if (message.value !== '') {
		const interval = setInterval(() => {
			message.value = '';

			clearInterval(interval);
		}, 2000);
	}
});
</script>

<template>
	<f7Page class="relative flex flex-col">
		<!--Nab Bar-->
		<f7Navbar :title="store.currentBook === '' ? '' : 'Prossa'" large>
			<template #left>
				<f7Link panel-open="left" navbar><IconMenu2></IconMenu2></f7Link>
			</template>

			<template #right>
				<div class="fixed right-0 mr-2 flex">
					<f7Button popup-open=".stats-popup" rounded tonal-material small>
						<IconFlame></IconFlame> {{ store.daysOfReading }}</f7Button
					>
					<kLink
						class="mt-1 hidden"
						@click="
							() => $router.push({ name: '/', params: { search: 'search' } })
						"
						navbar
						><IconSearch></IconSearch
					></kLink>
				</div>
			</template>

			<template #title-large>
				<!-- Current Book -->
				<div class="flex w-full flex-auto flex-col">
					<!-- Book Hero -->
					<div
						v-if="store.currentBook !== ''"
						class="mb-8 flex flex-auto select-none flex-row gap-2 overflow-hidden"
					>
						<img
							class="my-auto flex h-20 rounded shadow"
							v-if="store.currentBook !== ''"
							:src="JSON.parse(store.getBook(store.currentBook)?.img as unknown as string)"
						/>
						<div
							v-if="store.currentBook !== ''"
							class="my-auto flex flex-auto flex-col gap-1 text-md-dark-surface-2 dark:text-md-light-surface-2"
						>
							<div class="my-auto flex max-w-sm flex-col">
								<p class="max-w-[16rem] text-lg font-bold">
									{{ store.getBook(store.currentBook)?.metadata.title }}
								</p>
								<p class="text-xs">
									{{ store.getBook(store.currentBook)?.metadata.creator }}
								</p>
							</div>
						</div>
					</div>

					<p class="mx-auto my-auto text-center text-gray-500" v-else>
						Lets read a book
					</p>
				</div>
			</template>

			<template #subnavbar>
				<f7Searchbar></f7Searchbar>
			</template>

			<f7Subnavbar>
				<f7Searchbar
					@click:disable="query = ''"
					@input="(ev) => (query = ev.target.value)"
					:value="query"
				></f7Searchbar>
			</f7Subnavbar>
		</f7Navbar>

		<!-- Book List -->
		<BookList
			:books="
				computed(() =>
					store.books.filter(
						(book) =>
							book.metadata.title.toUpperCase().indexOf(query.toUpperCase()) >
							-1
					)
				).value
			"
			v-if="store.books.length > 0"
		></BookList>

		<!-- Empty State -->
		<div class="mx-auto my-auto flex h-full text-gray-400" v-else>
			<div class="my-auto mx-auto">
				<IconBooks :size="84" class="mx-auto"></IconBooks>
				<p class="mx-auto text-center">No Books</p>
			</div>
		</div>

		<!-- FAB -->
		<template #fixed>
			<f7Fab @click="pickFile">
				<IconPlus></IconPlus>
			</f7Fab>
		</template>
	</f7Page>
</template>
