Vue.component('argument', {
    props: ['title', 'weight', 'isAdvantage'],
    template: `<li class="argument">
                   <span class="weight" contenteditable="true" @blur="weightUpdated">{{ weight }}</span>
                   <span class="title" contenteditable="true" @blur="titleUpdated">{{ title }}</span>
                   <span class="remove" @click="remove">×</span>
               </li>`,
    methods: {
        remove: function () {
            this.$emit('remove');
        },
        weightUpdated: function (e) {
            let weight = parseInt(e.target.innerText);
            if (weight >= 10) {
                weight = 9;
            }
            if (weight <= 0) {
                weight = 1;
            }
            this.$emit('weight-updated', weight);
        },
        titleUpdated: function (e) {
            this.$emit('title-updated', e.target.innerText);
        }
    }
});

new Vue({
    el: '#app',
    data: {
        title: 'My arguments',
        newArgument: '',
        arguments: []
    },
    computed: {
        advantagesNumber: function () {
            return this.arguments.reduce(function (sum, argument) {
                if (argument.isAdvantage) {
                    sum += argument.weight;
                }
                return sum;
            }, 0);
        },
        disadvantagesNumber: function () {
            return this.arguments.reduce(function (sum, argument) {
                if (!argument.isAdvantage) {
                    sum += argument.weight;
                }
                return sum;
            }, 0);
        }
    },
    methods: {
        parseTitle: function (title) {
            let matches = title.match(/([+-]) ?(.*?) (\d)/);

            if (!matches) {
                return null;
            }

            return {
                isAdvantage: matches[1] === '+',
                title: matches[2],
                weight: parseInt(matches[3])
            };
        },
        addArgument: function () {
            let argument = this.parseTitle(this.newArgument);
            if (argument !== null) {
                this.arguments.push(argument);
                this.newArgument = '';
                this.saveArguments();
            }
        },
        removeArgument: function (index) {
            this.arguments.splice(index, 1);
            this.saveArguments();
        },
        weightUpdated: function (index, value) {
            let argument = this.arguments[index];
            argument.weight = value;
            this.$set(this.arguments, index, argument);
            this.saveArguments();
        },
        titleUpdated: function (index, value) {
            let argument = this.arguments[index];
            argument.title = value;
            this.$set(this.arguments, index, argument);
            this.saveArguments();
        },
        saveTitle: function (e) {
            this.title = e.target.innerText;
            localStorage.setItem('title', this.title);
        },
        saveArguments: function () {
            localStorage.setItem('arguments', JSON.stringify(this.arguments));
        }
    },
    mounted() {
        let title = localStorage.getItem('title');
        if (title) {
            this.title = title;
        }

        let arguments = localStorage.getItem('arguments');
        if (arguments) {
            this.arguments = JSON.parse(arguments);
        }
    }
});
