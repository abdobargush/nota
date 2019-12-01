<template>
	<div class="home">
		<navbar></navbar>
		<div id="content">
			<div class="container">
				<div v-masonry class="grid" transition-duration=".3s"
					itemSelector=".grid-item"
					percentPosition="true">
					<div v-masonry-tile class="grid-item" v-for="note in getNotes" :key="note.id">
						<show-note :note="note"></show-note>
					</div>
				</div>
			</div>
		</div>
		<note-form></note-form>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bus } from '@/main'

/*
Masonry component
*/
import Vue from 'vue'
import {VueMasonryPlugin} from 'vue-masonry'
Vue.use(VueMasonryPlugin)

/*
Components
*/
import Navbar from '@/components/Navbar.vue'
import NoteForm from '@/components/NoteForm.vue'
import ShowNote from '@/components/ShowNote.vue'

export default {
	name: 'home',
	components: {
		Navbar,
		ShowNote,
		NoteForm
	},
	beforeCreate() {
		// Fetch current user
		this.$store.dispatch('setUser')
	},
	mounted() {
		// Get notes
		this.$store.dispatch('getNotes')

		// Rearrange notes after edit
		bus.$on('endEdit', ()=>{
			this.$redrawVueMasonry()
		})
	},
	beforeDestroy() {
		this.$store.dispatch('destroyNotes')
	},
	computed: {
		...mapGetters([
			'getNotes',
		])
	}
}
</script>

<style lang="scss" scoped>
.grid {
	display: block;
}
.grid-item {
	width: 100%;
}
@media screen and (min-width: 768px) {
	.grid {
		margin-right: -15px;
	}
	.grid-item {
		margin-right: 15px;
		width: calc(50% - 15px);
	}
}
@media screen and (min-width: 1024px){
	.grid {
		margin-right: -15px;
	}
	.grid-item {
		margin-right: 15px;
		width: calc(25% - 15px);
	}
}
</style>
