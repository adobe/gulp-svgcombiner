# gulp-svgcombiner
> Combine your SVGs

## Usage

```js
gulp.src('test/icons/*')
  .pipe(svgcombiner({
    processName: function(fileName, folderPath, fileObj) {
      return 'spectrum-css-icon-' + fileName.replace(/S_UI(.*?)_.*?.svg/, '$1');
    },
    processClass: function(processedName, folderPath, fileObj) {
      // Return the last directory
      return 'spectrum-UIIcon--' + folderPath.split('/').pop();
    }
  }))
  .pipe(gulp.dest('dist/icons/'));
```
