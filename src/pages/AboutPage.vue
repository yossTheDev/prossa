<script setup lang="ts">
import { IconMenu2 } from '@tabler/icons-vue';
import { kLink, kNavbar, kPage } from 'konsta/vue';
</script>

<template>
	<kPage class="relative flex flex-col">
		<kNavbar class="md:hidden" large title="About">
			<template #left>
				<kLink
					@click="
						() => $router.push({ name: 'about', params: { menu: 'menu' } })
					"
					navbar
					><IconMenu2></IconMenu2
				></kLink>
			</template>
		</kNavbar>

		<p>Prossa</p>
	</kPage>
</template>
