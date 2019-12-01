<template>
	<nav>
		<div class="nav-container">
			<div class="nav-brand">
				<img src="@/assets/logo@2x.png" width="42" height="42" class="logo">
				<span class="brand-text">Nota</span>
			</div>
			<div :class="`nav-search ${searchActive ? 'active' : ''}`">
				<i class="material-icons search-icon">search</i>
				<input type="text" class="search-control" placeholder="Search Notes ..."
					v-model="query"
					@input="handleFilter(query)"
					@focus="toggleSearch"
					@blur="toggleSearch">
				<span class="search-label">
					<span v-if="colorSuggestions">Colors: red, purple, blue, green, orange</span>
					<span v-else-if="tagSuggestions">
						Tags: 
						<template v-for="(tag,index) in getTags">
							{{tag}}<template v-if="index != getTags.length-1">, </template>
						</template>
					</span>
					<span v-else>Filter using "\tag:" or "\color:"</span>
				</span>
			</div>
			<div class="nav-user">
				<span>Welcome, <template v-if="getUser">{{getUser.displayName}}</template></span>
			</div>
			<button @click="logout" class="nav-button"><i class="material-icons">power_settings_new</i></button>
		</div>
	</nav>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import {mapGetters} from 'vuex'

export default {
	data() {
		return {
			query: '',
			searchActive: false,
			colorSuggestions: false,
			tagSuggestions: false,
		}
	},
	methods: {
		toggleSearch() {
			this.searchActive = !this.searchActive
		},
		handleFilter(query) {
			if (query.startsWith('') && query.startsWith('\\tag:')) {
				this.filterByTag(query.substring(5).trim())

				// Show tag suggestions
				this.tagSuggestions = true
			} else if (query.startsWith('\\color:')) {
				this.filterByColor(query.substring(7).trim())

				// Show color suggestions
				this.colorSuggestions = true
			} else {
				this.filterByText(query)

				// Stop suggestions
				this.colorSuggestions = false
				this.tagSuggestions = false
			}
		},
		filterByText(query) {
			this.$store.dispatch('filterNotes', query)
		},
		filterByTag(tag) {
			this.$store.dispatch('filterNotesByTag', tag)
		},
		filterByColor(color) {
			this.$store.dispatch('filterNotesByColor', color)
		},
		logout() {
			firebase.auth().signOut()
			.then(()=>{
				this.$router.go()
			})
		}
	},
	computed: {
		...mapGetters([
			'getTags',
			'getUser'
		])
	}
}
</script>

<style lang="scss" scoped>
nav {
	background-color: #FDCB6E;
	height: 60px;
}
.nav-container {
	height: 100%;
	max-width: 1100px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	padding: 0 15px;
}
.nav-brand {
	margin-right: 30px;

	* {
		vertical-align: middle;
	}
	.brand-text {
		color: rgba($color: #000000, $alpha: .87);
		font-weight: 700;
		font-size: 22px;
		margin-left: 10px;

	}
	@media screen and (max-width: 768px) {
		margin-right: 10px;
		.brand-text {
			display: none;
		}
	}
}
.nav-search {
	position: relative;

	.search-icon {
		color:rgba($color: #000000, $alpha: .54);
		position: absolute;
		left: 15px;
		top: 50%;
		transform: translateY(-50%);
	}
	.search-control {
		display: block;
		background-color: rgba($color: #000000, $alpha: .1);
		border: 0;
		border-radius: 5px;
		height: 42px;
		width: 400px;
		padding: 15px;
		padding-left: 54px;
	
		&:focus {
			background-color: #fff;
		}
	}
	.search-label {
		display: none;
		position: absolute;
		width: 100%;
		padding: 5px 15px;
		color: rgba($color: #000000, $alpha: 0.54);
		font-size: 12px;
		background-color: #eeeeee;
		border-radius: 0 0 5px 5px;
		z-index: 999;
	}

	&.active {
		box-shadow: 0 3px 6px rgba($color: #000000, $alpha: .16);
		
		.search-control {
			border-radius: 5px 5px 0 0;
			border-bottom: 1px solid #e0e0e0;
			padding-bottom: 14px;
		}
		.search-label {
			display: block;
			box-shadow: 0 3px 6px rgba($color: #000000, $alpha: .16);
		}
	}

	@media screen and (max-width: 768px) {
		width: 100%;

		.search-control {
			width: 100%
		}
	}
}
.nav-user {
	margin-left: auto;

	@media screen and (max-width: 768px) {
		display: none;
	}
}
.nav-button {
	background: transparent;
	border: 0;
	margin-left: 5px;

	@media screen and (max-width: 768px) {
		margin-left: 10px;
	}
}
</style>