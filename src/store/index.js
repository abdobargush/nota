import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/firebase'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		notes: [],
		filteredNotes: [],
		filtersApplied: false,
		tags: [],
		user: null
	},
	getters: {
		getNotes(state) {
			if (state.filtersApplied) {
				return state.filteredNotes;
			} else {
				return state.notes;
			}
		},
		getTags(state) {
			return state.tags
		},
		getUser(state) {
			return state.user
		}
	},
	mutations: {
		pushNote(state, note) {
			state.notes.push(note)
		},
		addNote(state, note) {
			state.notes.unshift(note)
			// Reset filtersApplied
			state.filtersApplied = false
		},
		deleteNote(state, note) {
			state.notes = state.notes.filter(data => {
				return data.id != note.id
			})
			// Reset filtersApplied
			state.filtersApplied = false
		},

		/*
		Filter
		*/
		filterNotes(state, filteredNotes) {
			state.filteredNotes = filteredNotes
			// Set filtersApplied to change notes source
			state.filtersApplied = true
		},

		/* 
		Tags
		*/
		pushTag(state, tag) {
			// Push tag
			if (tag && !state.tags.includes(tag) ) {
				state.tags.push(tag)
			}
		}
	},
	actions: {
		getNotes (context) {
			db.collection('notes').orderBy('createdAt', 'desc')
			.where('userID', '==', context.state.user.uid)
			.get().then(snapshot => {
				snapshot.forEach(doc => {
					let note = doc.data()
					note.id = doc.id
					context.commit('pushNote', note)

					// Compute Tags list
					if (doc.data().tag) {
						context.commit('pushTag', doc.data().tag)
					}
				})
			})
		},
		destroyNotes(context) {
			context.state.notes = []
			context.state.filteredNotes = []
			context.state.tags = []
			context.state.filtersApplied = false
		},

		/*
		Single note
		*/
		addNote(context, note) {
			db.collection('notes').add(note).then( ref => {
				// Add id to the note
				note.id = ref.id
				// Add note with mutations
				context.commit('addNote', note)

				// Add tag to tags list
				if (note.tag) {
					context.commit('pushTag', note.tag)
				}
			})
		},
		editNote(context, note) {
			db.collection('notes').doc(note.id).set(note, {merge: true})
		},
		deleteNote(context, note) {
			db.collection('notes').doc(note.id).delete()
			.then(()=>{
				// Delete note from notes in state
				context.commit('deleteNote', note)
			})
		},

		/*
		Notes filters
		*/
		filterNotes(context, query) {
			let filteredNotes = context.state.notes.filter(note => {
				// convert terms tolowercase
				let title = note.title.toLowerCase()
				let content = note.content.toLowerCase()
				let lowerQuery = query.toLowerCase()
				return title.includes(lowerQuery) || content.includes(lowerQuery)
			})
			context.commit('filterNotes', filteredNotes)
		},
		filterNotesByTag(context, tag) {
			let filteredNotes = context.state.notes.filter(note => {
				return note.tag.toLowerCase().includes(tag.toLowerCase())
			})
			context.commit('filterNotes', filteredNotes)
		},
		filterNotesByColor(context, color) {
			let filteredNotes = context.state.notes.filter(note => {
				if (note.color) {
					return note.color.label.toLowerCase() == color.toLowerCase()
				} else {
					return false
				}
			})
			context.commit('filterNotes', filteredNotes)
		},

		/*
		User
		*/
		setUser(context) {
			context.state.user = firebase.auth().currentUser
		}
	}
})
