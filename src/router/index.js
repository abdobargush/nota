import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'

/*
Views
*/
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '*',
		component: NotFound
	},
	{
		path: '/',
		name: 'home',
		component: Home,
		beforeEnter: authGuard
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
		beforeEnter: guestGuard
	},
	{
		path: '/signup',
		name: 'signup',
		component: Signup,
		beforeEnter: guestGuard
	}
]

/*
Guards
*/
function authGuard(from, to, next) {
	const unsubscribe = firebase.auth().onAuthStateChanged( user => {
		if (user) {
			next()
		} else {
			next('/login')
		}
		unsubscribe()
	})
}
function guestGuard(from, to, next) {
	const unsubscribe = firebase.auth().onAuthStateChanged( user => {
		if (!user) {
			next()
		} else {
			next('/')
		}
		unsubscribe()
	})
}

const router = new VueRouter({
	routes
})

export default router
