<template>
	<div :class="`card note-card ${startEdit ? 'opacity-0' : ''}`" 
		@click="openEdit" 
		:style="note.color ? `border-bottom:4px solid ${note.color.hex}` : ''">

		<h3 v-if="note.title" :class="`note-title ${!note.content ? 'mb-0' : ''}`">
			{{ note.title }}
		</h3>
		<p v-if="note.content" class="note-content">
			{{ note.content }}
		</p>
		<p v-if="note.tag" class="note-tag">
			<i class="material-icons">label</i>
			{{ note.tag }}
		</p>

	</div>
</template>

<script>
import { bus } from '@/main'
export default {
	props: ['note'],
	data() {
		return {
			startEdit: false
		}
	},
	mounted(){
		// Show note again after edit
		bus.$on('endEdit', ()=>{
			this.startEdit = false
		})
	},
	methods: {
		openEdit() {
			bus.$emit('openEdit', this.note)

			// Hide note being edited
			this.startEdit = true
		}
	}
}
</script>

<style lang="scss" scoped>
.note-card {
	cursor: pointer;
}
.note-title {
	font-size: 20px;
	font-weight: 700;
	margin-top: 0;
	margin-bottom: 10px;
	line-height: 1.3;
}
.note-content {
	margin-bottom: 0;
	margin-top: 0;
	line-height: 1.4;
}
.note-tag {
	color: #2196f3;
	margin-top: 20px;
	margin-bottom: 0;

	i {
		margin-right: 5px;
	}
}
.opacity-0 {
	opacity: 0;
}
</style>