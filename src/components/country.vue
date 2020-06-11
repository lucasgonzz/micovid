<template>
    <div class="card" v-if="country.length > 0">
        <p class="title">
            En {{ country[0].Country }} por día
        </p>
        <ul>
            <li v-for="(country_case, i) in country"
                :key="i">
                <span class="title">
                    {{ date(country_case.Date) }}
                </span>
                <span class="data">
                    {{ format(country_case.Confirmed) }}
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
	props: {
		country: Array,
	},
    methods: {
        fromDate(country) {
            this.$emit('fromDate', country)
        }
    }
}
</script>