var Vue = require('vue');
Vue.use(require('vue-resource'));

Vue.component('branch', require('./branch'));
Vue.component('branches', require('./branches'));

var vm = new Vue({

    el: '#app',

    components: {
        'page-tree': require('./page-tree')
    }

});
