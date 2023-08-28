<script setup lang="ts">
import { kPage, kNavbar, kLink } from 'konsta/vue';
import { IconMenu2 } from '@tabler/icons-vue';
import { useAppStore } from '../stores/AppStore';

const store = useAppStore();
</script>

<template>
	<kPage class="relative flex flex-col">
		<kNavbar class="md:hidden" large title="About">
			<template #left>
				<kLink @click="() => store.setShowMenu(true)" navbar
					><IconMenu2></IconMenu2
				></kLink>
			</template>
		</kNavbar>

		<p>Prossa</p>
	</kPage>
</template>
