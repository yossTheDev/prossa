<script setup lang="ts">
import ProssaIcon from '../components/Icons/ProssaIcon.vue';
import {
	IconBrandTwitter,
	IconBrandTelegram,
	IconBrandGithub,
} from '@tabler/icons-vue';
</script>

<template>
	<div
		class="my-auto mx-auto flex select-none flex-col rounded-2xl bg-base-100 p-4 dark:text-white"
	>
		<p class="text-xl font-bold">About</p>

		<div class="flex flex-auto flex-col p-2">
			<ProssaIcon class="mx-auto h-28 w-28"></ProssaIcon>

			<p class="mt-2 text-center text-3xl font-bold">Prossa</p>
			<p class="mt-2 w-60 text-center">
				Prossa is a Free and Open Source Web-Based Ebook Reader. Made with ❤️
				and VueJS
			</p>

			<p class="text-center text-gray-600">by yossthedev</p>

			<div class="mx-auto mt-2 flex w-fit flex-row flex-wrap gap-2 p-2">
				<a
					href="https://twitter.com/yossthedev"
					target="_blank"
					class="flex flex-auto cursor-pointer select-none flex-row gap-1 rounded-3xl bg-base-200 p-3 hover:bg-neutral hover:bg-gradient-to-bl dark:text-white"
				>
					<div class="mx-auto my-auto flex flex-row">
						<IconBrandTwitter></IconBrandTwitter>
					</div>
				</a>

				<a
					href="https://t.me/yossthedev"
					target="_blank"
					class="flex flex-auto cursor-pointer select-none flex-row gap-1 rounded-3xl bg-base-200 p-3 hover:bg-neutral hover:bg-gradient-to-bl dark:text-white"
				>
					<div class="mx-auto my-auto flex flex-row">
						<IconBrandTelegram></IconBrandTelegram>
					</div>
				</a>

				<a
					href="https://github.com/yossthedev"
					target="_blank"
					class="flex flex-auto cursor-pointer select-none flex-row gap-1 rounded-3xl bg-base-200 p-3 hover:bg-neutral hover:bg-gradient-to-bl dark:text-white"
				>
					<div class="mx-auto my-auto flex flex-row">
						<IconBrandGithub></IconBrandGithub>
					</div>
				</a>
			</div>
		</div>
	</div>
</template>
