import moment from 'moment'
export default {
	methods: {
        date(d) {
            return moment(d).format('DD/MM/YY')
        },
        format(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
        },
        // cases(province) {
        //     let cases = 0
        //     province.cities.forEach(city => {
        //         cases += city.confirmed
        //     })
        //     return this.format(cases)
        // }
	}
}