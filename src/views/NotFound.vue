<template>
	<div class="error-container">
		<div class="error-content">
			<span class="error-icon">:(</span>
			<h3 class="error-title">404: Page not found.</h3>
			<router-link to="/" class="error-button">Back to home <i class="material-icons">arrow_forward</i></router-link>
		</div>
	</div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.error-container {
	background-color: #FDCB6E;
	height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.error-content {
	text-align: center;
}
.error-icon {
	font-size: 120px;
	margin-bottom: 20px;
}
.error-title {
	font-size: 36px;
}
.error-button {
	font-weight: 700;
	text-decoration: none;
	color: inherit;
	text-transform: uppercase;
	padding: 10px 0;
	border-bottom: 2px dashed rgba($color: #000000, $alpha: .87);
}
</style>