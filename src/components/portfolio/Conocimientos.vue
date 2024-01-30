<template v-if="conocimientos">
      <div class="container mt-5">
        <h1 class="text-center fg-dark wow fadeInUp">Mis conocimientos</h1>
        <div class="row py-3">
          <div class="col-md-6">
			<template v-if="conocimientos[0]">
				<div class="progress-wrapper wow fadeInUp" v-for="(value, key) in conocimientos[0]" :key="key">
					<span class="caption">{{ value }}</span>
					<div class="progress">
						<div class="progress-bar" role="progressbar" :style="`width: ${conocimientos_p[0][key]}%;`" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">{{ conocimientos_p[0][key] + '%' }}</div>
					</div>
				</div>
			</template>
			<template v-if="conocimientos[2]">
				<div class="progress-wrapper wow fadeInUp" v-for="(value, key) in conocimientos[2]" :key="key">
					<span class="caption">{{ value }}</span>
					<div class="progress">
						<div class="progress-bar" role="progressbar" :style="`width: ${conocimientos_p[2][key]}%;`" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">{{ conocimientos_p[2][key] + '%' }}</div>
					</div>
				</div>
			</template>
          </div>
          <div class="col-md-6">
			<template v-if="conocimientos[1]">
				<div class="progress-wrapper wow fadeInUp" v-for="(value, key) in conocimientos[1]" :key="key">
					<span class="caption">{{ value }}</span>
					<div class="progress">
						<div class="progress-bar" role="progressbar" :style="`width: ${conocimientos_p[1][key]}%;`" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">{{ conocimientos_p[1][key] + '%' }}</div>
					</div>
				</div>
			</template>
          </div>
        </div>
      </div> <!-- End skills -->
</template>

<script>
export default {
	props:{
		conocimientos:{
			type: Object,
			required: true
		},
		conocimientos_p:{
			type: Object,
			required: true
		}
	}
}
</script>

<style>

</style>
