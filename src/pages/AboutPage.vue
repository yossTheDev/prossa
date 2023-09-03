<script setup lang="ts">
import { kNavbar, kPage } from 'konsta/vue';
</script>

<template>
	<kPage class="relative flex flex-col">
		<kNavbar class="md:hidden" large title="About">
			<template #left> </template>
		</kNavbar>

		<p>Prossa</p>
	</kPage>
</template>
