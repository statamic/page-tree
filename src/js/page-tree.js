var _ = require('underscore');
var $ = jQuery = require('jquery');
require('jquery-sortable');
var pageData = require('./page-data');

module.exports = {

    template: require('./page-tree.template.html'),

    data: function() {
        return {
            loading: true,
            saving: false,
            changed: false,
            showUrls: false,
            pages: []
        }
    },

    ready: function() {
        this.getPages();
    },

    methods: {

        getPages: function() {
            // var url = cp_url('/content/pages/get');

            // this.$http.get(url, function(data) {
            //     this.pages = data.pages;
            //     this.loading = false;

            //     this.$nextTick(function() {
            //         this.initSortable();
            //     });
            // });
            
            var self = this;
            setTimeout(function() {
                self.pages = pageData;
                self.loading = false;
                self.$nextTick(function() {
                    self.initSortable();
                });
            }, 1000);
        },

        initSortable: function() {
            self = this;
            var draggedIndex, draggedPage, draggedInstance;

            var placeholder = '' +
                '<li class="branch branch-placeholder">' +
                    '<div class="branch-row depth-{{ depth }}">' +
                        '<div class="page-indent">' +
                            '<span class="page-toggle"></span>' +
                            '<span class="page-move drag-handle"></span>' +
                            '<span class="indent-arrow"></span>' +
                        '</div>' +
                        '<div class="page-text">&nbsp;</div>' +
                    '</div>' +
                '</li>';

            $(this.$el).find('.page-tree > ul + ul').sortable({
                containerSelector: 'ul',
                handle: 'li',
                placeholderClass: 'branch-placeholder',
                placeholder: placeholder,
                bodyClass: 'page-tree-dragging',
                draggedClass: 'branch-dragged',
                onDragStart: function($item, container, _super, event) {
                    // Grab the original page we're dragging now so we can move it later.
                    var branch = $item[0].__vue__;
                    draggedInstance = branch;
                    draggedIndex = branch.branchIndex;
                    draggedPage = branch.$parent.pages[draggedIndex];

                    // Let the plugin continue
                    _super($item, container);
                },
                onDrag: function($item, container, _super, event) {
                    // Update the placeholder template to show the page name.
                    $('.branch-placeholder').find('.page-text').text(draggedPage.title);
                    _super($item, container);
                },
                onDrop: function($item, container, _super, event) {
                    self.changed = true;

                    // Remove the page from its original place
                    draggedInstance.$parent.pages.splice(draggedIndex, 1);

                    // Get the drop position
                    var dropIndex = $item.index();
                    var parentInstance = $item.parent()[0].__vue__;

                    // Update the page to use the new parent's url (recursively)
                    draggedPage = self.updateDroppedUrl(draggedPage, parentInstance.$parent.url);

                    // Get the new page's position and inject it into the data
                    parentInstance.pages.splice(dropIndex, 0, draggedPage);

                    // Force the Vue component to reload itself
                    var pages = self.pages;
                    self.pages = [];
                    self.$nextTick(function() {
                        self.pages = pages;
                    });

                    // Let the plugin continue
                    _super($item, container);
                }
            });
        },

        updateDroppedUrl: function(page, url) {
            var self = this;
            page.url = url + '/' + page.slug;

            page.items = _.map(page.items, function(child) {
                return self.updateDroppedUrl(child, page.url);
            });

            return page;
        },

        expandAll: function() {
            this.toggleAll(false);
        },

        collapseAll: function() {
            this.toggleAll(true);
        },

        toggleAll: function(collapsed, pages) {
            var self = this;

            pages = pages || self.pages;

            _.each(pages, function(page) {
                page.$set('collapsed', collapsed);
                if (page.items.length) {
                    self.toggleAll(collapsed, page.items);
                }
            });
        },

        toggleUrls: function() {
            this.showUrls = !this.showUrls;
        },

        save: function() {
            var self = this;

            self.saving = true;

            var pages = JSON.parse(JSON.stringify(self.pages));
            pages = self.updateOrderIndexes(pages);

            // this.$http.post(cp_url('/content/pages'), { pages: pages }).success(function(data) {
            //     self.getPages();
            //     self.changed = false;
            //     self.saving = false;
            // });
            
            setTimeout(function() {
                self.getPages();
                self.changed = false;
                self.saving = false;
            }, 1500);
        },

        updateOrderIndexes: function(pages) {
            var self = this;

            return _.map(pages, function(item, i) {
                // Recursively iterate over any children
                if (item.items.length) {
                    item.items = self.updateOrderIndexes(item.items);
                }

                // We need the 1-based indexes
                item.order = i + 1;

                return item;
            });
        }

    }

};