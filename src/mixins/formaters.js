import moment from 'moment'
export default {
	methods: {
        date(d) {
            return moment(d).format('DD/MM/YY')
        },
        format(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
	}
}