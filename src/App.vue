<template>
<div id="app">
    <main>
        <b-container fluid>
            <search 
            :countries="countries"
            @showCountry="showCountry"
            @setLoading="setLoading"></search>
            <loader :loading="loading"></loader>
            <back 
            v-show="(country_cases.length > 0 || provinces.length > 0) && !loading"
            @back="back"></back>
            <global-cases 
            v-if="country_cases.length == 0 && provinces.length == 0 && !loading"
            :provinces="provinces" 
            :global_cases="global_cases" 
            :country_cases="country_cases" 
            @back="back"></global-cases>
            <countries 
            v-if="!loading && countries.length"
            :provinces="provinces" 
            :country_cases="country_cases" 
            :countries="countries" 
            @showCountry="showCountry"></countries>
            <country-cases 
            v-show="!loading"
            :provinces="provinces" 
            :country_cases="country_cases"
            @fromDate="fromDate"></country-cases>
        </b-container>
    </main>
</div>
</template>

<script>
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'
 
import Search from './components/Search.vue'
import Loader from './components/Loader.vue'
import GlobalCases from './components/GlobalCases.vue'
import Countries from './components/Countries.vue'
import CountryCases from './components/CountryCases.vue'
import Back from './components/Back.vue'

export default {
    name: 'App',
    components: {
        Search,
        Loader,
        GlobalCases,
        Countries,
        CountryCases,
        Back,
    },
    data() {
        return {
            global_cases: {},
            countries: [],
            country_cases: [],
            provinces: [],

            loading: true,
        }
    },
    created() {
        this.getData()
    },
    methods: {
        setLoading(value) {
            this.loading = value
        },
        back() {
            this.country_cases = []
            this.provinces = []
            this.getData()
        },  
        getData() {
            this.loading = true
            this.$axios.get('summary')
            .then(res => {
                console.log(res.data)
                this.loading = false
                this.global_cases = res.data.Global
                this.countries = res.data.Countries
                this.orderCountries()
            })
            .catch(err => {
                this.loading = false
                console.log(err)
            })
        },
        orderCountries() {
            this.countries.sort(function(a, b) {
                return b.TotalConfirmed - a.TotalConfirmed;
            });
        },
        orderProvinces() {
            this.provinces.sort(function(a, b) {
                return this.cases(b) - this.cases(a);
            });
        },

        isSpecialCountry(country) {
            if (country.Slug == 'united-states' || country.Slug == 'united-kingdom' || country.Slug == 'france' || country.Slug == 'canada' || country.Slug == 'china' || country.Slug == 'netherlands') {
                return true
            } 
            return false
        },
        // Countries
        showCountry(country) {
            console.log(country)
            this.loading = true
            loadProgressBar()
            let url = ''
            if (this.isSpecialCountry(country)) {
                let to = this.countries[0].Date
                let hora = to.substring(11, 19)
                to = to.replace(hora, '00:00:00')
                let day_to = Number(to.substring(8, 10))
                let from = to.replace(day_to, day_to-1)
                url += `country/${country.Slug}?from=${from}&to=${to}`
            } else {
                url += 'country/'+country.Slug
            }
            this.$axios.get(url)
            .then(res => {
                // console.log(res.data)
                this.loading = false
                if (this.isSpecialCountry(country)) {
                    this.setCountryWithProvinces(res.data)
                } else {
                    this.setCountry(res.data)
                }
            })
        },
        setCountryWithProvinces(provinces) {
            provinces.forEach(province => { 
                if (!this.includesProvince(province)) {
                    let _province = {}
                    _province.name = province.Province
                    _province.cities = []

                    let city = {}
                    city.name = province.City
                    city.confirmed = province.Confirmed
                    city.deaths = province.Deaths
                    city.recovered = province.Recovered

                    _province.cities.push(city)
                    _province.Country = province.Country
                    this.provinces.push(_province)
                } else {
                    let _province = this.getProvince(province)

                    let city = {}
                    city.name = province.city
                    city.confirmed = province.Confirmed
                    city.deaths = province.Deaths
                    city.recovered = province.Recovered
                    _province.cities.push(city)
                    _province.Country = province.Country
                }
            })
            this.calculateTotal(provinces[0])
        },
        calculateTotal(first_province) {
            let confirmed = 0
            let deaths = 0
            let recovered = 0
            let index = 0
            this.provinces.forEach(province => {
                index++
                if (index == this.provinces.length) {
                    console.log('entro con ')
                    console.log(this.provinces[index-1])
                    this.provinces.splice(index-1, 1)
                } else {
                    let confirmed_city = 0
                    let deaths_city = 0
                    let recovered_city = 0
                    province.cities.forEach(city => {
                        confirmed_city += city.confirmed
                        deaths_city += city.deaths
                        recovered_city += city.recovered
                    })
                    province.confirmed = confirmed_city
                    province.deaths = deaths_city
                    province.recovered = recovered_city
                    confirmed += confirmed_city
                    deaths += deaths_city
                    recovered += recovered_city
                }
            })
            this.global_cases.TotalConfirmed = confirmed 
            this.global_cases.TotalDeaths = deaths 
            this.global_cases.TotalRecovered = recovered 
            this.global_cases.country = first_province.Country
        },
        includesProvince(province) {
            let has_province = false
            this.provinces.forEach(_province => {
                if (_province.name == province.Province) {
                    has_province = true
                }
            }) 
            return has_province
        },
        getProvince(province) {
            let prov = {}
            this.provinces.forEach(_province => {
                if (_province.name == province.Province) {
                    prov = _province
                }
            })
            return prov
        },
        setCountry(country_cases) {
            this.country_cases = country_cases
            this.country_cases = this.country_cases.reverse()
            let last_day = this.country_cases[0]
            this.global_cases.TotalConfirmed = last_day.Confirmed 
            this.global_cases.TotalDeaths = last_day.Deaths 
            this.global_cases.TotalRecovered = last_day.Recovered 
        },

        // Country
        async fromDate(country) {
            this.loading = true
            let url = `${this.api_url}world?from=${country.Date}&to=${country.Date}`
            console.log(`url: ${url}`)
            let res = await this.$axios.get(url)
            console.log(res)
        }
    }
}
</script>

<style>

#nprogress .bar {
    background: #FFF !important;
}

#nprogress .peg {
    box-shadow: 0 0 10px #FFF, 0 0 5px #FFF !important;
}

#nprogress .spinner-icon {
    border-top-color: #FFF !important;
    border-left-color: #FFF !important;
}
* {
    box-sizing: border-box;
    font-family: Nunito, Helvetica, Arial, sans-serif
}
#app {
    background-size: cover;
    background-position: bottom;
    background: linear-gradient(#66ADF7, #2971BD);
    transition: background-color 0.4s ease;
    min-height: 100vh;
    max-height: 100vh;
    overflow: auto;
    padding: 1em 0;
}
.row {
    justify-content: center;
    margin-bottom: 1em;
}
.row:last-child {
    margin-bottom: 0;
}
.title {
    text-align: center;
    font-weight: 700;
    font-size: 1.2em;
    color: #FFF;
    text-shadow: 1px 1px 5px #000;
    margin: 0;
}
.card {
    -webkit-box-shadow: 0px 2px 8px -2px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 2px 8px -2px rgba(0,0,0,0.75);
    box-shadow: 0px 2px 8px -2px rgba(0,0,0,0.75);
    background: rgba(255,255,255,.5);
}
.card:last-child {
    margin-bottom: 0;
}
.card-body {
    padding: 0;
    display: flex;
    justify-content: space-between;
}
.card-data {
    font-weight: bold;
    font-size: 1.1em;
    color: #333;
}
#app.bg-red {
    background-color: #DA0E0E;
}
.result-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.card{
    width: 100%;
    border-radius: .3em;
    padding: .7em;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}
</style>
