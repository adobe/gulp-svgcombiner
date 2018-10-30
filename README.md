# gulp-svgcombiner
> A gulp plugin for svgcombiner

## Usage

First, install `gulp-svgcombiner` as a development dependency:

```shell
npm install --save-dev gulp-svgcombiner
```

Then, add it to your `gulpfile.js`:

### Combine SVGs in two directories

If you have a directory structure such as:

```
├── gulpfile.js
└── icons/
    └── medium/
    |   └── S_UICheckboxCheckmark_12_N@1x.svg
    └── large/
        └── S_UICheckboxCheckmark_12_N@1x.svg
```

You could configure `gulp-svgcombiner` as follows:

```js
gulp.src('icons/**/*.svg')
  .pipe(svgcombiner({
    processName: function(filePath) {
      // Add a prefix and extra the icon name from the fileName
      return 'icon-' + fileName.replace(/S_UI(.*?)_.*/, '$1');
    },
    processClass: function(filePath) {
      return 'icon-' + path.dirname(filePath).split(path.sep).pop();
    }
  }))
  .pipe(gulp.dest('dist/icons/'));
```

The result would be
```
└── dist/
    └── icons/
        └── CheckboxCheckmark.svg
```

`CheckboxCheckmark.svg` would have the following contents:

```xml
<svg xmlns="http://www.w3.org/2000/svg" id="icon-CheckboxCheckmark">
  <path d="M10.5,3.50771A1,1,0,0,0,8.7927,2.801L4.75,6.84361,3.2073,5.301A1,1,0,0,0,1.76872,6.69043L4.0433,8.965a1,1,0,0,0,1.4141,0l4.75-4.75A.99672.99672,0,0,0,10.5,3.50771Z" class="icon-medium"/>
  <path d="M12,2.50126a1,1,0,0,0-1.7073-.708L4.5,7.5859,2.2073,5.2933a1,1,0,1,0-1.414,1.414L3.7927,9.7067a1,1,0,0,0,1.4147,0l6.4994-6.4994A.99669.99669,0,0,0,12,2.50126Z" class="icon-large"/>
</svg>
```

Assuming you've embedded this SVG in the page and referenced the symbol with `<use>`:

```
<div class="checkbox">
  <svg class="icon" focusable="false" aria-hidden="true">
    <use xlink:href="#icon-CheckboxCheckmark"></use>
  </svg>
</div>
```

You could then use the following CSS to switch between the medium and large icons:


```css
/* Hide all icons by default */
.icon-medium,
.icon-large {
  display: none;
}

/* Show the large icons when in large mode */
.ui-large .icon-large {
  display: inline;
}

/* Show the medium icons when in medium mode */
.ui-medium .icon-medium {
  display: inline;
}
```

Or, you could use media queries to switch between icon sets:

```css
// Show medium icons by default
.icon-medium {
  display: inline;
}

.icon-large {
  display: none;
}

@media (min-width:480px) {
  // Show the large icons on small screens
  .icon-large {
    display: inline;
  }

  .ui-medium .icon-medium {
    display: none;
  }
}
```

## API

### svgcombiner([options])

#### options
Type: `Object`

##### options.processName(filePath)
Type: `function`  
Default: Strip file extension

This function serves two purposes:

1. Normalize naming differences between icons
2. Name your icons

For instance, if you have an icon naming convention that includes the size of the icon, your `processName` function should remove the size of the icon from the name, as well as strip the extension and any other irrelevant text.

### Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
