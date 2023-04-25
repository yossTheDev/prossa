<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue';
import {
	IconBook,
	IconBooks,
	IconInfoCircle,
	IconPlus,
	IconClock,
	IconChartBar,
} from '@tabler/icons-vue';
import { Book } from 'epubjs';
import { DateTime } from 'luxon';
import { ref } from 'vue';
import { Base64Binary } from '../../src/utilities/base';
import BookList from '../components/BookList.vue';
import DaysOfReading from '../components/DaysOfReading.vue';
import AboutModal from '../components/AboutModal.vue';
import ProssaIcon from '../components/Icons/ProssaIcon.vue';
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
	<!-- Nav Bar -->
	<div
		class="z-20 mt-3 flex max-h-12 flex-auto select-none md:my-auto md:h-96 md:max-h-full md:max-w-fit"
	>
		<div
			class="my-auto mx-4 flex flex-auto rounded-full bg-white p-2 dark:bg-base-200 dark:text-white md:mx-0 md:ml-2 md:w-16 md:flex-col"
		>
			<!-- Left -->
			<div
				class="my-auto flex h-full w-1/3 md:my-0 md:mx-auto md:mb-auto md:w-full md:flex-col md:gap-3"
			>
				<!-- App Logo-->
				<div class="mx-auto my-auto mt-2 hidden h-9 md:flex">
					<ProssaIcon></ProssaIcon>
				</div>

				<!-- Add Book -->
				<div
					class="my-auto ml-auto hidden h-6 cursor-pointer rounded-full bg-slate-200/20 bg-black p-1 transition-all hover:bg-primary hover:text-white hover:shadow hover:transition-all active:scale-90 dark:text-black md:mx-auto md:mt-2 md:flex md:h-10 md:w-10 md:bg-primary md:text-white"
				>
					<label class="cursor my-auto mx-auto cursor-pointer" for="input">
						<IconPlus
							class="mx-auto my-auto text-white dark:text-black"
						></IconPlus>

						<input
							id="input"
							name="input"
							accept="*.epub"
							class="rounded bg-gray-200"
							@change="handleAddBook"
							hidden
							type="file"
						/>
					</label>
				</div>

				<!-- Info -->
				<div
					class="hidden rounded-full p-2 transition-all hover:bg-neutral active:scale-90 md:block"
				>
					<IconInfoCircle
						@click="showModal = true"
						class="mx-auto mt-auto hidden h-9 md:flex"
					></IconInfoCircle>
				</div>

				<!-- Info Mobile -->
				<div
					class="rounded-full p-2 transition-all hover:bg-neutral active:scale-90 md:hidden"
				>
					<IconInfoCircle
						@click="showModal = true"
						class="mx-auto"
					></IconInfoCircle>
				</div>
			</div>

			<!-- Center -->
			<div class="my-auto flex w-1/3 flex-auto md:mx-auto md:hidden md:w-full">
				<div class="mx-auto my-auto h-8">
					<ProssaIcon></ProssaIcon>
				</div>
			</div>

			<!-- Right -->
			<div
				class="my-auto flex w-1/3 flex-auto md:mx-auto md:mt-auto md:hidden md:w-full"
			>
				<!-- Add Book -->
				<div
					class="my-auto ml-auto cursor-pointer rounded-full bg-slate-200/20 bg-primary p-1 transition-all hover:bg-primary hover:text-white hover:shadow hover:transition-all active:scale-90 dark:text-black md:hidden md:text-white"
				>
					<label class="cursor my-auto mx-auto cursor-pointer" for="input">
						<IconPlus
							class="mx-auto my-auto text-white dark:text-black"
						></IconPlus>

						<input
							id="input"
							name="input"
							accept="*.epub"
							class="rounded bg-gray-200"
							@change="handleAddBook"
							hidden
							type="file"
						/>
					</label>
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="z-20 flex flex-auto flex-col overflow-hidden lg:flex-row">
		<!-- Current Book -->
		<div
			class="mt-2 flex h-full max-h-40 flex-auto flex-col gap-2 overflow-hidden p-4 md:mt-0 lg:h-full lg:max-h-full lg:w-1/3"
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
					class="flex flex-auto flex-col gap-1 text-gray-500"
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
			class="flex h-full flex-auto flex-col overflow-hidden lg:w-full lg:grow-0 lg:bg-gray-200 dark:lg:bg-black/25"
		>
			<!--Stats-->
			<div class="flex h-fit select-none gap-1 p-2 md:p-1">
				<!-- Last Reading Time-->
				<div
					class="my-auto ml-2 flex h-fit flex-row gap-1 rounded-2xl bg-base-200 p-2 dark:text-white"
				>
					<IconChartBar></IconChartBar>
					<p class="mr-1 font-bold">Stats</p>
				</div>

				<!-- Days Of Reading-->
				<DaysOfReading class="my-auto ml-auto"></DaysOfReading>

				<!-- Last Reading Time-->
				<div
					class="my-auto flex h-fit flex-row gap-1 rounded-2xl bg-base-200 p-2 dark:text-white"
				>
					<IconClock></IconClock>
					<p class="my-auto mr-1 hidden font-bold md:block">
						Last Reading Time:
					</p>
					<p class="my-auto">
						{{ DateTime.fromISO(store.lastReadingTime).toRelative() }}
					</p>
				</div>
			</div>

			<!-- Separator -->
			<div
				class="ml-4 mt-4 flex select-none flex-row gap-2 text-gray-500 md:mt-5"
			>
				<IconBook class="my-auto" :size="18"></IconBook>
				<p class="my-auto text-xs lg:text-xl">Library</p>
				<div
					class="my-auto ml-2 h-1 w-full rounded-full bg-gray-200/50 dark:bg-base-dark-light md:hidden"
				></div>
			</div>

			<!-- Book List -->
			<div
				v-if="store.books.length > 0"
				class="flex flex-auto overflow-hidden p-3"
			>
				<div
					class="flex flex-auto flex-col overflow-auto md:flex-row md:flex-wrap"
				>
					<!--Book Item-->
					<BookList></BookList>
				</div>
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
	<div v-if="message !== ''" class="toast">
		<div
			class="alert alert-info bg-black text-white dark:bg-white dark:text-black"
		>
			<div>
				<span>{{ message }}</span>
			</div>
		</div>
	</div>

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
</template>
