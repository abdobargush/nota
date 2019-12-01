<template>
	<div id="content">
		<form class="form-container" @submit.prevent="signup">
			<div class="form-header">
				<img src="@/assets/logo@2x.png" width="56" height="56" class="logo" alt="">
				<h1 class="form-title">Signup</h1>
			</div>
			<div class="form-card">
				<div v-if="error" class="error">
					<i class="material-icons">error</i>
					<span>Email address is already registered!</span>
				</div>
				<div class="form-group">
					<label for="name">Name</label>
					<input type="text" name="name" id="name" class="form-control"
						v-model="name"
						required>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" name="email" id="email" class="form-control"
						v-model="email"
						required>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" name="password" id="password" class="form-control"
						v-model="password"
						required>
				</div>
				<button class="button button-primary button-wide" 
					:disabled="loading ? true : false">
					Signup
				</button>
			</div>
			<div class="form-footer">
				Have an account? <router-link to="/login">Login</router-link>
			</div>
		</form>
	</div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
	name: 'Signup',
	data() {
		return {
			name: null,
			email: null,
			password: null,
			error: false,
			loading: false
		}
	},
	methods: {
		signup() {
			// Set loading
			this.loading = true

			firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
			.then(() => {
				// Set display name
				firebase.auth().currentUser.updateProfile({
					displayName: this.name
				}).then(()=>{
					// Resdirect to home
					this.$router.push('/')
				})
			})
			.catch( error => {
				if (error.code == 'auth/email-already-in-use') {
					this.error = true
				}
			}).then(()=>{
				// Reset loading
				this.loading = false
			});
		}
	}
}
</script>

<style lang="scss" scoped>
#content {
	&::before {
		height: 300px;
	}
}
</style>