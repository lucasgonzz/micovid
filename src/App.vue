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
            <div class="result-main card">
                <p class="title" v-if="country.length == 0">En el mundo</p>
                <p class="title" v-else>
                    En {{ country[0].Country }} <button @click="back()" class="volver">Volver</button>
                </p>
                <p class="main">
                    {{ format(main.TotalConfirmed) }}
                    <span class="text-casos">
                        casos
                    </span>
                </p>
                <ul>
                    <li>
                        <span class="title">
                            Fallecidos
                        </span>
                        <span class="data">
                            {{ format(main.TotalDeaths) }}
                        </span>
                    </li>
                    <li>
                        <span class="title">
                            Recuperados
                        </span>
                        <span class="data">
                            {{ format(main.TotalRecovered) }}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="countries card" v-show="country.length == 0">
                <p class="title">
                    Paises con mas casos
                </p>
                <ul>
                    <li v-for="country in countries"
                        :key="country.Slug">
                        <span class="title">
                            {{ country.Country }}
                        </span>
                        <span class="data">
                            {{ format(country.TotalConfirmed) }}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="country card" v-if="country.length > 0">
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
        </div>
    </main>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import Loader from './components/Loader.vue'
export default {
    name: 'App',
    components: {
        Autocomplete,
        Loader,
    },
    data() {
        return {
            api_url: 'https://api.covid19api.com/',
            main: {},
            countries: [],
            country: [],

            loading: false,
        }
    },
    created() {
        this.getData()
    },
    methods: {
        format(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
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
                this.country = res.data
                this.country = this.country.reverse()
                let last_day = this.country[0]
                this.main.TotalConfirmed = last_day.Confirmed 
                this.main.TotalDeaths = last_day.Deaths 
                this.main.TotalRecovered = last_day.Recovered 
            })
            .catch(err => {
                console.log(err)
                this.loading = false
            })
        },
        date(d) {
            return moment(d).format('DD/MM/YY')
        },
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
}
main {
    min-height: 100vh;
    max-height: 100vh;
    overflow: auto;
    background: linear-gradient(#5F9FE2, #2971BD);
    padding: 1em;
}
.search-box {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}
.search-input {
    width: 90%;
}
.volver {
    text-shadow: none;
    padding: .2em 1em;
    border: 2px solid #5F9FE2;
    border-radius: .7em;
    font-size: 1em;
    color: #333;
}
.result-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.card{
    width: 85%;
    background: rgba(255,255,255,.5);
    border-radius: .3em;
    padding: .7em;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}
.card-padding {
    padding: 0 .7em;
}
.result-main p {
    margin: 0;
}
.result-main > .title-main {
    font-size: 1em;
    color: #FFF;
    text-shadow: 2px 2px 1px #000;
}
.text-casos {
    text-shadow: 2px 2px 1px #000;
    font-size: .3em;
    display: block;
}
.card > .title {
    text-align: start;
    font-weight: 700;
    font-size: 1.2em;
    border-left: 4px solid #2971BD;
    padding: .5em .7em;
    color: #FFF;
    text-shadow: 1px 1px 5px #000;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.result-main .main {
    font-weight: 700;
    font-size: 3.5em;
    color: #FFF;
    text-shadow: 2px 2px 2px #000;
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
}
li .data {
    font-size: 1.2em;
    font-weight: 700;
}
</style>
