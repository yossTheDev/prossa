import { PackagingMetadataObject } from 'epubjs/types/packaging';
import { defineStore } from 'pinia';
import { DateTime, Interval } from 'luxon';

interface Book {
	key: string;
	currentCfi: string;
	percent: string;
	img: string;
	book: any;
	added: string;
	metadata: PackagingMetadataObject;
}

interface AppStore {
	currentBook: string;
	daysOfReading: number;
	lastReadingTime: string;
	readingTimeThisMonth: string;
	books: Book[];
}

export const useAppStore = defineStore('app-store', {
	state: (): AppStore => {
		return {
			currentBook: '',
			books: [],
			lastReadingTime: DateTime.now().toISO() as unknown as string,
			daysOfReading: 0,
			readingTimeThisMonth: Interval.fromDateTimes(
				DateTime.now(),
				DateTime.now()
			)
				.toDuration(['hours', 'minutes'])
				.toISO() as unknown as string,
		};
	},

	actions: {
		addBook(book: Book) {
			this.books.push(book);
		},

		deleteBook(key: string) {
			this.books = this.books.filter((e) => e.key != key);
		},

		setCurrentBook(id: string) {
			this.currentBook = id;
		},

		setBookCFI(bookIndex: string, cfi: string, percent: string) {
			/* New Book Array */
			const newArray: Book[] = [];
			for (let i = 0; i < this.books.length; i++) {
				this.books[i].key === bookIndex
					? newArray.push({
							key: this.books[i].key,
							img: this.books[i].img,
							book: this.books[i].book,
							metadata: this.books[i].metadata,
							added: this.books[i].added,
							percent: percent,
							currentCfi: cfi,
					  })
					: newArray.push(this.books[i]);
			}

			this.books = newArray;
		},

		getBook(bookID: string) {
			for (const book of this.books) {
				if (book.key === bookID) return book;
			}
		},

		setReadingTimeThisMonth(interval: string) {
			this.readingTimeThisMonth = interval;
		},

		addDayOfReading() {
			this.daysOfReading++;
		},
	},
});
