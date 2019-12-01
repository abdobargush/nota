<template>
	<div id="content">
		<form action="" class="form-container" @submit.prevent="login">
			<div class="form-header">
				<img src="@/assets/logo@2x.png" width="56" height="56" class="logo" alt="">
				<h1 class="form-title">Login</h1>
			</div>
			<div class="form-card">
				<div v-if="error" class="error">
					<i class="material-icons">error</i>
					<span>Wrong email or password!</span>
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
					Login
				</button>
			</div>
			<div class="form-footer">
				Need an account? <router-link to="/signup">Signup</router-link>
			</div>
		</form>
	</div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
	name: 'Login',
	data() {
		return {
			email: null,
			password: null,
			error: false,
			loading: false
		}
	},
	methods: {
		login() {
			// Set loading
			this.loading = true

			firebase.auth().signInWithEmailAndPassword(this.email, this.password)
			.then(user => {
				// Resdirect to home
				if (user) this.$router.push('/')
			})
			.catch( error => {
				if (
					error.code == 'auth/wrong-password' || 
					error.code == 'auth/user-not-found'
				) {
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