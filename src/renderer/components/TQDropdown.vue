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
            if(toggle == false){
                toggle = this.isHovered ? true : false
            }
            this.dropdownOpened = toggle
        },
        forceCloseDropdown(){
            this.isHovered = false
            this.dropdownOpened = false
        }
    }
}

</script>

<template>
    <div class="tq-dropdown">
        <button type="button" class="tq-btn -xs -transparent" @click.stop="toggleDropdown(!dropdownOpened)" @blur="toggleDropdown(false)">
            {{ buttonText }} <i class="pe-7s-more"></i>
        </button>
        <div v-if="dropdownOpened" @click="forceCloseDropdown" @mouseover="isHovered = true" @mouseout="isHovered = false" class="tq-dropdown-content">
            <slot></slot>
        </div>
    </div>
</template>
