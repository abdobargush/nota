<template>
	<div class="note-form-container">
		<div v-if="openForm" ref="addNoteCard" class="card note-form-card" 
			:style="note.color ? `border-bottom: 4px solid ${note.color.hex}` : ''">
			<div class="options-group">
				<button v-if="editMode" class="button button-danger" @click="deleteNote">Delete</button>
				<button v-else class="button button-outline" @click="dismissForm">Dismiss</button>
				<button class="button button-primary" @click="submitNote" 
					:disabled="!note.title && !note.content ? 'true' : false">
					Save
				</button>
			</div>
			<div class="title-group">
				<span v-if="!note.title" @click="setFocus('note-title')" class="title-label">Title</span>
				<content-editable id="note-title" v-model="note.title" class="title-control"></content-editable>
			</div>
			<div class="content-group">
				<span v-if="!note.content" @click="setFocus(content)" class="content-label">Content</span>
				<content-editable id="note-content" v-model="note.content" class="content-control"></content-editable>
			</div>
			<div class="tag-group">
				<i class="material-icons">label</i>
				<input type="text" v-model="note.tag" class="tag-control" placeholder="Tag">
			</div>
			<div class="color-group">
				<span>
					<button @click="resetColor" class="color-btn reset"></button>
				</span>
				<span v-for="color in colors" :key="color.label">
					<button :class="`color-btn ${note.color && color.label == note.color.label ? 'active' : ''}`" 
						:style="`background-color: ${color.hex}`"
						@click="setColor(color)">
					</button>
				</span>
			</div>
		</div>
		<div v-if="openForm" @click="submitNote" class="overlay"></div>
		<button @click="openNoteForm" class="fab"><i class="material-icons">add</i></button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bus } from '@/main'
import ContentEditable from '@/components/helpers/ContentEditable.vue'

export default {
	name: 'AddNote',
	components: {
		ContentEditable
	},
	data() {
		return {
			openForm: false,
			note: {
				title: '',
				content: '',
				tag: '',
				color: null,
				userID: null
			},
			editMode: false,
			colors: [
				{
					label: 'red',
					hex: '#e57373'
				},
				{
					label: 'purple',
					hex: '#ba68c8'
				},
				{
					label: 'blue',
					hex: '#64b5f6'
				},
				{
					label: 'green',
					hex: '#81c784'
				},
				{
					label: 'orange',
					hex: '#ff8a65'
				}
			]
		}
	},
	mounted() {
		// Listen for openEdit
		bus.$on('openEdit', note => {
			this.note = note
			this.openForm = true
			this.editMode = true
		})
	},
	methods: {
		setColor(color) {
			this.note.color = color
		},
		resetColor() {
			this.note.color = undefined
		},
		submitNote() {
			// Dismiss if note is empty
			if (!this.note.title && !this.note.content) {
				this.dismissForm()
				return false
			}

			/*
			Submit note
			*/
			// Generate note object
			let note = {
				title: this.note.title,
				content: this.note.content,
				tag: this.note.tag,
				color: this.note.color,
				userID: this.getUser.uid
			}

			if (this.editMode) {
				// Edit note
				note.id = this.note.id
				this.$store.dispatch('editNote', note).then(()=>{
					this.dismissForm()
				})

				// Emit endEdit to rearange grid
				bus.$emit('endEdit')
			} else {
				// Add creation time to note
				note.createdAt = Date.now()

				// Add new note
				this.$store.dispatch('addNote', note).then(()=>{
					this.dismissForm()
				})
			}
		},
		dismissForm() {
			// Reset note
			this.note = {
				title: '',
				content: '',
				tag: '',
				color: null,
			}
			this.openForm = false
			this.editMode = false
		},
		deleteNote() {
			this.$store.dispatch('deleteNote', this.note)

			// End edit
			this.dismissForm()
		},
		openNoteForm() {
			this.openForm = true
		},
		setFocus(id) {
			document.getElementById(id).focus()
		}
	},
	computed: {
		...mapGetters(['getUser'])
	}
}
</script>

<style lang="scss" scoped>
.options-group {
	background-color: #eeeeee;
	padding: 10px;
	margin: -15px;
	margin-bottom: 15px;
	border-radius: 5px 5px 0 0;
	border-bottom: 1px solid #e0e0e0;
	display: flex;
	justify-content: space-between;
}
.title-group {
	line-height: 1.3;

	.title-label {
		color: rgba($color: #000000, $alpha: 0.54);
		display: block;
		position: absolute;
		font-size: 20px;
		font-weight: 700;
	}
	.title-control {
		border: 0;
		padding: 0;
		font-size: 20px;
		font-weight: 700;
		display: block;
		width: 100%;
		margin-bottom: 10px;
	}
}
.content-group {
	margin-bottom: 20px;
	line-height: 1.6;

	.content-label {
		display: block;
		position: absolute;
		font-size: 16px;
		color: rgba($color: #000000, $alpha: 0.54);
	}
	.content-control {
		border: 0;
		display: block;
		width: 100%;
		min-height: 100px;
	}
}
.tag-group {
	color: #03A9F4;
	margin-bottom: 15px;

	.tag-control {
		color: #2196f3;
		border: 0;
		margin-left: 5px;
		width: calc(100% - 29px);
	}
}
.color-group {
	display: flex;

	span {
		flex: 0 1 100%;
		text-align: center;
	}
	.color-btn {
		height: 24px;
		width: 24px;
		display: inline-block;
		border-radius: 50%;
		border: 0;

		&.active {
			border: 3px solid #2196f3;
		}
		&.reset {
			border: 2px solid rgba($color: #000000, $alpha: 0.25);
		}
	}
}
.note-form-card {
	position: absolute;
	width: 400px;
	top: 100px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 999;

	@media screen and (max-width: 768px) {
		top: 0;
		border-radius: 0;
		width: 100%;
	}
}
.fab {
	position: fixed;
	right: 30px;
	bottom: 30px;
	background-color: #FDCB6E;
	height: 60px;
	width: 60px;
	border-radius: 50%;
	border: 0;
	box-shadow: 0 3px 15px rgba($color: #000000, $alpha: .16);

	i {
		font-size: 32px;
	}
}
.overlay {
	position: fixed;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	height: 100%;
	background-color: #000;
	opacity: .7;
	z-index: 1;
}
</style>