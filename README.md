# Vue.js Page Tree
> Adapted from Statamic 2

### Getting started

Install the node modules, and run Gulp to build into the `dist` folder.

```
npm install
bower install
gulp
```

A demo can be viewed at `index.html`.

### Notes

- AJAX requests have been commented out and replaced with `setTimeout` calls.
- The `jquery-sortable` module will conflict with jQuery UI's Sortable plugin. If you need to use both (we do, in Statamic) you'll need to:
  - Make a copy of the plugin file
  - Rename it to something else like `nestedSortable`. The name is passed into the plugin in the last line of the file. You can simply modify that.
  - Include it in your build process.
  - Update the `.sortable()` call in the [page tree file](https://github.com/wilderborn/page-tree/blob/master/src/js/page-tree.js#L64) to whatever you renamed it.