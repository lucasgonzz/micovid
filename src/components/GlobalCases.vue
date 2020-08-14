<template> 
	<b-row class="si">
		<b-col md="6">
			<b-card>
				<b-container>
					<b-row>
						<b-col>
							<p class="title title-without-margin">
								En el mundo
							</p>
							<p class="global_cases">
								{{ format(global_cases.TotalConfirmed) }}
								<span class="text-casos">
									casos
								</span>
							</p>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-card class="fallecidos">
								<span>
									Fallecidos
								</span>
								<span>
									{{ format(global_cases.TotalDeaths) }}
								</span>
							</b-card>
							<b-card class="recuperados">
								<span>
									Recuperados
								</span>
								<span class="data">
									{{ format(global_cases.TotalRecovered) }}
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
		global_cases: Object,
		provinces: Array,
	},
	methods: {
		back() {
			this.$emit('back')
		},
	}
}
</script>
<style>
.container {
	padding: 0px !important;
}
p {
	margin: 0;	
}
.title-without-margin {
	margin-bottom: 0;
}
.global_cases {
	font-weight: bold;
	font-size: 3em;
	color: #FFF;
	text-shadow: 2px 2px 2px #000;
	/*margin-bottom: .5em;*/
}
.text-casos {
	font-weight: bold;
	text-shadow: 2px 2px 1px #000;
	font-size: .5em;
	display: block;
}
.fallecidos {
	font-weight: bold;
	font-size: 1.1em;
}
.recuperados {
	font-weight: bold;
	font-size: 1.1em;
}
.volver {
	text-shadow: none;
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