<script setup lang="ts">
import { IconMenu2 } from '@tabler/icons-vue';
import {
	f7BlockTitle,
	f7Link,
	f7List,
	f7ListItem,
	f7Navbar,
	f7Page,
	f7Sheet,
	f7Toolbar,
} from 'framework7-vue';
import { useAppStore } from '../stores/AppStore';
import { AccentColors } from '../utilities/AccentColors';

const store = useAppStore();
</script>

<template>
	<f7Page>
		<f7Navbar large transparent title="Settings">
			<template #left>
				<f7Link panel-open="left" navbar><IconMenu2></IconMenu2></f7Link>
			</template>
		</f7Navbar>

		<f7BlockTitle>Appearance</f7BlockTitle>
		<f7Block>
			<f7List media-list dividers strong inset>
				<f7ListItem link sheet-open=".theme_sheet" title="Theme">
					<template #subtitle>
						<p v-if="store.Theme === 'auto'">auto</p>
						<p v-if="store.Theme === true">dark</p>
						<p v-if="store.Theme === false">light</p>
					</template>
				</f7ListItem>

				<f7ListItem sheet-open=".color_sheet" link title="Accent Color">
					<template #media>
						<div
							:style="{ backgroundColor: store.Color }"
							class="h-6 w-6 rounded-full p-2"
						></div>
					</template>
				</f7ListItem>
			</f7List>
		</f7Block>

		<f7Sheet swipe-to-close class="theme_sheet">
			<f7Page>
				<f7Toolbar>
					<f7Toolbar>
						<div class="left"></div>
						<div class="right">
							<f7Link sheet-close>Close</f7Link>
						</div>
					</f7Toolbar>
				</f7Toolbar>
				<f7List dividers>
					<f7ListItem
						@click="() => (store.Theme = 'auto')"
						name="theme_radio"
						radio
						title="Auto"
						:checked="store.Theme === 'auto'"
						sheet-close=".theme_sheet"
					></f7ListItem>

					<f7ListItem
						@click="() => (store.Theme = true)"
						name="theme_radio"
						radio
						title="Dark"
						sheet-close=".theme_sheet"
						:checked="store.Theme === true"
					></f7ListItem>
					<f7ListItem
						@click="() => (store.Theme = false)"
						name="theme_radio"
						radio
						title="Light"
						sheet-close=".theme_sheet"
						:checked="store.Theme === false"
					></f7ListItem>
				</f7List>
			</f7Page>
		</f7Sheet>

		<f7Sheet swipe-to-close class="color_sheet">
			<f7Page>
				<f7Toolbar>
					<div class="left"></div>
					<div class="right">
						<f7Link sheet-close>Close</f7Link>
					</div>
				</f7Toolbar>
				<f7List dividers>
					<f7ListItem
						:key="name"
						:title="name"
						v-for="{ name, value } in AccentColors"
						@click="() => (store.Color = value)"
						name="theme_radio"
						radio
						:checked="store.Color === value"
						sheet-close=".theme_sheet"
					>
						<template #media>
							<div
								:style="{ backgroundColor: value }"
								class="rounded-full p-2"
							></div>
						</template>
					</f7ListItem>
				</f7List>
			</f7Page>
		</f7Sheet>
	</f7Page>
</template>
