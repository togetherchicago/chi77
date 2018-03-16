    var dropdown = new Vue ({
        data() {
            showMenu: false,
            selectedOption: {
              name: undefined
            },
            options: {
              'hello'
            }
        },
        props: {
            options: {
                type: [Array, Object]
            },
            selected: {},
        },

        mounted() {
            this.selectedOption = this.selected;
        },

        methods: {
            updateOption(option) {
                this.selectedOption = option;
                this.showMenu = false;
                this.$emit('updateOption', this.selectedOption);
            },

            toggleMenu() {
              this.showMenu = !this.showMenu;
            }
        }
    })
