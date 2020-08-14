<template>
    <b-row>
        <b-col md="6">
            <autocomplete
            class="search-input"
            :search="search"
            auto-select
            @submit="submit"
            :get-result-value="getResultValue"
            placeholder="Buscar un pais..."
            aria-label="Buscar un pais..."
            ></autocomplete>
        </b-col>
    </b-row>
</template>
<script>
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
export default {
	props: ['countries'],
	components: {
        Autocomplete,
	},
	methods: {
        search(input) {
            if (input.length < 1) { return [] }
            return this.countries.filter(country => {
                return country.Country.toLowerCase()
                .startsWith(input.toLowerCase())
            })
        },
        submit(result) {
            this.$emit('showCountry', result)
			// this.$emit('setLoading', true)
			// let url = 'country/'+result.Slug
			// this.$axios.get(url)
   //          .then(res => {
			// 	this.$emit('setLoading', false)
   //              console.log(res.data)
   //              this.$emit('setCountry', res.data)
   //          })
   //          .catch(err => {
   //              console.log(err)
   //              this.loading = false
   //          })
        },
        getResultValue(result) {
            return result.Country
        },
	}
}
</script>
<style scpoed>
.search-box {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.search-input {
    width: 100%;
    -webkit-box-shadow: 0px 2px 8px -2px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 2px 8px -2px rgba(0,0,0,0.75);
    box-shadow: 0px 2px 8px -2px rgba(0,0,0,0.75);
    border-radius: 8px;
}

</style>