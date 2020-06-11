<template>
    <div class="card" v-show="country.length == 0">
        <p class="title">
            Paises con mas casos
        </p>
        <ul>
            <li v-for="country in countries"
                :key="country.Slug">
                <button class="title" @click="showCountry(country)">
                    {{ country.Country }}
                </button>
                <span class="data">
                    {{ format(country.TotalConfirmed) }}
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
	props: {
        countries: Array,
		country: Array,
	},
	methods: {
		showCountry(country) {
			this.$emit('showCountry', country)
		}
	}
}
</script>
<style scoped>
button {
    background: none;
    border: none;
    cursor: pointer;
}
</style>