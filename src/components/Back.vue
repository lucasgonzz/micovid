<template>
<b-row class="row-back">
	<b-col md="6">
		<b-button
		@click="back"
		variant="primary"
		block>
			Volver a listar paises
		</b-button>
	</b-col>
</b-row>
</template>
<script>
export default {
	methods: {
		back() {
			this.$emit('back')
		}
	}
}
</script>
<style>
.row-back {
	margin-bottom: 0 !important;
}
</style>