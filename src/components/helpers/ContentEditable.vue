<template>
	<div contenteditable="true" v-once v-html="value" :value="value" @input="$emit('input', $event.target.innerText)"></div>
</template>

<script>
export default {
	name: 'ContentEditable',
	props: ['value'],
	watch: {
        value: function (newValue) {
            if (document.activeElement == this.$el) {
                return;
            }

            this.$el.innerHTML = newValue;
        }
    }
}
</script>