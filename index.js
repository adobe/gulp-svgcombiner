var through = require('through2');
var extend = require('xtend');
var path = require('path');
var File = require('vinyl');
var svgcombiner = require('svgcombiner');

module.exports = function(options) {
  options = extend({
    processName: function(filePath) {
      // The filename without extension
      return path.basename(filePath, path.extname(filePath));
    },
    processClass: function(filePath) {
      // The first folder name
      return path.dirname(filePath).split(path.sep).pop();
    }
  }, options);

  // Hash to hold all icons arranged by processed name
  var icons = {};
  var latestIcon = null;

  function gatherIcons(file, end, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // we don't do streams
    if (file.isStream()) {
      this.emit('error', new Error('gulp-svgcombiner: Streaming not supported'));
      cb();
      return;
    }

    // Process the name
    var processedName = options.processName(file.path);
    var processedClass = options.processClass(file.path);

    // Read the contents and put them into a map of maps
    icons[processedName] = icons[processedName] || {};
    icons[processedName][processedClass] = file.contents.toString('utf8');

    // Store the last icon we processed
    latestIcon = file;

    cb();
  }

  function combineIcons(cb) {
    // no files passed in, no file goes out
    if (!latestIcon) {
      cb();
      return;
    }

    // Run through hashmap
    for (var icon in icons) {
      var file = new File(icon + '.svg');

      // Combine all SVGs
      file.contents = new Buffer(svgcombiner(icon, icons[icon]));

      // Emit downstream
      this.push(file);
    }

    cb();
  }

  // Gather all the icons, then combine them
  return through.obj(gatherIcons, combineIcons);
};
