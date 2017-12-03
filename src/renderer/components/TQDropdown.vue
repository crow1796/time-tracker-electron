<script>

export default {
    name: 'tq-dropdown',
    props: {
        buttonText: {
            default: ''
        }
    },
    data(){
        return {
            dropdownOpened: false,
            isHovered: false
        }
    },
    methods: {
        toggleDropdown(toggle){
            if(toggle == false && this.isHovered) return true
            this.dropdownOpened = toggle
        }
    }
}

</script>

<template>
    <div class="tq-dropdown">
        <button type="button" class="tq-btn -xs -transparent" @click.stop="toggleDropdown(true)" @blur="toggleDropdown(false)">
            {{ buttonText }} <i class="pe-7s-more"></i>
        </button>
        <div v-if="dropdownOpened" @hover="isHovered = true" @mouseout="isHovered = false" class="tq-dropdown-content">
            <slot></slot>
        </div>
    </div>
</template>
