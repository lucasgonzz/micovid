<template>
    <b-row>
        <b-col md="6">
            <div class="card" v-show="country_cases.length == 0 && provinces.length == 0">
                <b-container>
                    <b-row>
                        <b-col>
                            <p class="title">
                                Paises con mas casos
                            </p>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-card 
                            @click="showCountry(country)"
                            v-for="country in countries"
                            :key="country.Slug">
                                <span class="card-data">
                                    {{ country.Country }}
                                </span>
                                <span class="card-data">
                                    {{ format(country.TotalConfirmed) }}
                                </span>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </b-col>
    </b-row>
</template>
<script>
export default {
	props: {
        countries: Array,
		country_cases: Array,
        provinces: Array,
	},
	methods: {
		showCountry(country) {
			this.$emit('showCountry', country)
		}
	}
}
</script>
<style scoped>
.card {
    cursor: pointer;
}
</style>