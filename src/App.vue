<template>
<div id="app">
    <main>
        <div class="search-box">
            <autocomplete
                class="search-input"
                :search="search"
                @submit="handleSubmit"
                :get-result-value="getResultValue"
                placeholder="Buscar un pais..."
                aria-label="Buscar un pais..."
                ></autocomplete>
        </div>
        <loader :loading="loading"></loader>
        <div 
            v-if="main.TotalConfirmed && !loading" 
            class="result-box">
            <result :main="main" :country="country" @back="back"></result>
            <countries :country="country" :countries="countries" @showCountry="showCountry"></countries>
            <country :country="country"
                    @fromDate="fromDate"></country>
        </div>
    </main>
</div>
</template>

<script>
import axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'

import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

import loader from './components/loader.vue'
import result from './components/result.vue'
import countries from './components/countries.vue'
import country from './components/country.vue'

export default {
    name: 'App',
    components: {
        Autocomplete,
        loader,
        result,
        countries,
        country,
    },
    data() {
        return {
            api_url: 'https://api.covid19api.com/',
            main: {},
            countries: [],
            country: [],

            loading: true,
        }
    },
    created() {
        this.getData()
    },
    methods: {
        back() {
            this.country = []
            this.getData()
        },  
        getData() {
            this.loading = true
            let url = this.api_url + 'summary'
            axios.get(url)
            .then(res => {
                this.loading = false
                this.main = res.data.Global
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
            this.countries_name = this.countries.map(country => {
                    return country.Country
            })
        },
        search(input) {
            if (input.length < 1) { return [] }
            return this.countries.filter(country => {
                return country.Country.toLowerCase()
                .startsWith(input.toLowerCase())
            })
        },
        getResultValue(result) {
            return result.Country
        },
        handleSubmit(result) {
            this.loading = true
            let url = this.api_url + 'country/'+result.Slug
            axios.get(url)
            .then(res => {
                this.loading = false
                this.setCountry(res.data)
            })
            .catch(err => {
                console.log(err)
                this.loading = false
            })
        },

        // Countries
        showCountry(country) {
            this.loading = true
            loadProgressBar()
            let url = this.api_url 
            if (country.Slug == 'united-states') {
                let to = this.countries[0].Date
                console.log(to)
                let day_to = Number(to.substring(8, 10))
                let from = to.replace(day_to, day_to-1)
                console.log(day_to)
                console.log(from)
                url += `country/united-states?from=${from}&to=${to}`
            } else {
                url += 'country/'+country.Slug
            }
            console.log(url)
            axios.get(url)
            .then(res => {
                this.loading = false
                if (country.Slug == 'united-states') {
                    this.setUsa()
                } else {
                    this.setCountry(res.data)
                }
            })
        },
        setUsa() {
            let provinces = []
            let provinces_name = []
            this.country.forEach(c => {
                if (this.includesProvince(c.Province)) {
                    let province = {}
                    let province.cities = []
                    let city = {}
                    city.name = c.city
                    city.confirmed = c.Confirmed
                    city.deaths = c.Deaths
                    city.recovered = c.Recovered

                    province.name = c.Province
                    province.cities.push(city)
                    provinces.push(province)
                } else {
                    let i = provinces.indexOf(c.Provice)
                    let province = provinces[i]
                    let city = {}
                    city.name = c.city
                    city.confirmed = c.Confirmed
                    city.deaths = c.Deaths
                    city.recovered = c.Recovered
                    provinces.push(city)
                }
            })
            this.country = provinces
            console.log(provinces)
        },
        includesProvince(province) {
            
        },
        setCountry(country) {
            this.country = country
            this.country = this.country.reverse()
            let last_day = this.country[0]
            this.main.TotalConfirmed = last_day.Confirmed 
            this.main.TotalDeaths = last_day.Deaths 
            this.main.TotalRecovered = last_day.Recovered 
        },

        // Country
        async fromDate(country) {
            this.loading = true
            let url = `${this.api_url}world?from=${country.Date}&to=${country.Date}`
            console.log(`url: ${url}`)
            let res = await axios.get(url)
            console.log(res)
        }
    }
}
</script>

<style>

#nprogress .bar {
    background: red !important;
}

#nprogress .peg {
    box-shadow: 0 0 10px red, 0 0 5px red !important;
}

#nprogress .spinner-icon {
    border-top-color: red !important;
    border-left-color: red !important;
}
* {
    box-sizing: border-box;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    background-size: cover;
    background-position: bottom;
    background: linear-gradient(#66ADF7, #2971BD);
    transition: background-color 0.4s ease;
    min-height: 100vh;
    max-height: 100vh;
    overflow: auto;
}
@media screen and (min-width: 768px) {
    main {
        width: 50%;
        margin: auto;
    }
}
#app.bg-red {
    background-color: #DA0E0E;
}
main {
    overflow: auto;
    padding: 1em;
}
.search-box {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}
.search-input {
    width: 100%;
}
.result-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.card{
    width: 100%;
    background: rgba(255,255,255,.5);
    border-radius: .3em;
    padding: .7em;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}
.card > .title {
    text-align: start;
    font-weight: 700;
    font-size: 1.2em;
    border-left: 4px solid #FFF;
    padding: .5em .7em;
    color: #FFF;
    text-shadow: 1px 1px 5px #000;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
li {
    border-bottom: 1px solid #333;
    padding: .7em 0;
    display: flex;
    justify-content: space-between;
}
li:last-child {
    border: none;
}
li .title {
    text-align: start;
    font-size: 1em;
    font-weight: 600;
}
li .data {
    font-size: 1.2em;
    font-weight: 700;
}
</style>
