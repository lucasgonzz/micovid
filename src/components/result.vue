<template>
	<div class="result-main card">
		<p class="title" v-if="country.length == 0">
			En el mundo
		</p>
		<p class="title" v-else>
			En {{ country[0].Country }} 
			<button class="volver" @click="back()">
			Volver
			</button>
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
</template>
<script>
export default {
	props: {
		main: Object,
		country: Array,
	},
	methods: {
		back() {
			this.$emit('back')
		},
	}
}
</script>
<style>
p {
	margin: 0;	
}
.main {
	font-weight: 700;
	font-size: 3.5em;
	color: #FFF;
	text-shadow: 2px 2px 2px #000;
}
.text-casos {
	text-shadow: 2px 2px 1px #000;
	font-size: .3em;
	display: block;
}
.volver {
	text-shadow: none;
	padding: .2em 1em;
	border: 2px solid #FFF;
	border-radius: .7em;
	font-size: 1em;
	color: #FFF;
	/*background: rgba(255,255,255,.5);*/
	font-weight: 600;
	background: none;
	cursor: pointer;
}
</style>