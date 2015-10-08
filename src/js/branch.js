module.exports = {

    template: require('./branch.template.html'),

    props: {
        branchIndex: Number,
        uuid: String,
        title: String,
        url: String,
        published: {
            type: Boolean,
            default: true
        },
        editUrl: String,
        hasEntries: Boolean,
        entriesUrl: String,
        createEntryUrl: String,
        childPages: {
            type: Array,
            default: function() {
                return [];
            }
        },
        collapsed: Boolean,
        depth: Number,
        home: {
            type: Boolean,
            default: false
        }
    },

    computed: {

        hasChildren: function() {
            return this.childPages.length;
        }

    },

    methods: {

        toggle: function() {
            this.collapsed = !this.collapsed;
        },

        createPage: function() {
            window.location = cp_url('content/pages/create' + this.url);
        },

        deletePage: function() {
            var self = this;

            swal({
                title: "Are you sure?",
                text: "You are about to delete this page.",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes I'm sure.",
                closeOnConfirm: false
            }, function() {
                self.$http.post(cp_url('content/pages/delete'), { uuid: self.uuid }).success(function() {
                    swal("Deleted!", "Your page has been deleted.", "success");
                    self.$parent.pages.splice(self.branchIndex, 1);
                });
            });
        }

    }

};
