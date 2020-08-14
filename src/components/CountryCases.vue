<template>
    <b-row v-if="country_cases.length > 0 || provinces.length > 0">
        <b-col md="6">
            <b-card>
                <b-container v-if="country_cases.length > 0 && provinces.length == 0">
                    <b-row>
                        <b-col>
                            <p class="title">
                                Casos de {{ country_cases[0].Country }} por día
                            </p>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-card
                            v-for="(country_case, i) in country_cases"
                            :key="i">
                                <span class="card-data">
                                    {{ date(country_case.Date) }}
                                </span>
                                <span class="card-data">
                                    {{ format(country_case.Confirmed) }}
                                </span>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-container>
                <b-container v-else>
                    <b-row>
                        <b-col>
                            <p class="title">
                                Casos de {{ provinces[0].Country }} por estado
                            </p>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-card
                            v-for="(province, i) in provinces"
                            :key="i">
                                <span class="card-data">
                                    {{ province.name }}
                                </span>
                                <span class="card-data">
                                    {{ format(province.confirmed) }}
                                </span>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-container>
            </b-card>
        </b-col>
    </b-row>
</template>
<script>
export default {
	props: {
		country_cases: Array,
        provinces: Array,
	},
    methods: {
        fromDate(country) {
            this.$emit('fromDate', country)
        },
        showProvince(province) {
            return province
        },
    }
}
</script>