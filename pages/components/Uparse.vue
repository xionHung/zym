<template>
	<u-parse :content="content" class="rich-txt" :loading="loading" no-data=""></u-parse>
</template>

<script>
import uParse from '@/components/u-parse/u-parse.vue';
export default {
	components: { uParse },
	props: {
		content: String,
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	}
};
</script>

<style>
@import url('@/components/u-parse/u-parse.css');
</style>
