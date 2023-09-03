import { PackagingMetadataObject } from 'epubjs/types/packaging';
import { defineStore } from 'pinia';
import { Duration } from 'luxon';
import { getRandomNumber } from '../utilities/getRandom';

export interface Book {
	key: string;
	currentCfi: string;
	percent: string;
	img: string;
	added: string;
	metadata: PackagingMetadataObject;
	selections?: Annotation[];
}

interface Annotation {
	id: string;
	color: string;
	cfiRange: string;
	text: string;
	href: string;
	label: string;
}

interface AppStore {
	currentBook: string;
	daysOfReading: number;
	lastReadingTime: string | null;
	readingTimeThisMonth: string;
	books: Book[];
}

export const useAppStore = defineStore('app-store', {
	state: (): AppStore => {
		return {
			currentBook: '',
			books: [],
			lastReadingTime: null,
			daysOfReading: 0,
			readingTimeThisMonth: Duration.fromMillis(0).toISO() as unknown as string,
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
							metadata: this.books[i].metadata,
							added: this.books[i].added,
							percent: percent,
							currentCfi: cfi,
							selections: this.books[i].selections,
					  })
					: newArray.push(this.books[i]);
			}

			this.books = newArray;
		},

		addBookHighlight(
			bookId: string,
			color: string,
			cfiRange: string,
			href: string,
			text: string,
			label: string
		) {
			this.books = this.books.map((book) =>
				book.key === bookId
					? {
							...book,
							selections: book.selections
								? [
										...book.selections,
										{
											cfiRange,
											href,
											text,
											label,
											id: getRandomNumber(),
											color,
										},
								  ]
								: [
										{
											cfiRange,
											href,
											text,
											label,
											id: getRandomNumber(),
											color,
										},
								  ],
					  }
					: book
			) as Book[];
		},

		removeBookHighlight(bookId: string, id: string) {
			console.log('removiendo ' + id);

			this.books = this.books.map((book) =>
				book.key === bookId
					? {
							...book,
							selections: book.selections?.filter((item) => item.id !== id),
					  }
					: book
			) as Book[];

			console.log(this.books);
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
