var test = require('ava');
var fs = require('fs');
var format = require('xml-formatter');
var path = require('path');
var File = require('vinyl');
var svgcombiner = require('../index.js');

function getFakeFile(filePath) {
  return new File({
    path: filePath,
    contents: new Buffer(fs.readFileSync(filePath, 'utf8'))
  });
}

test.cb('should define default processName and processClass', function(t) {
  // Create the fake files
  var medium = getFakeFile('test/medium/S_UICheckboxCheckmark_12_N@1x.svg');
  var large = getFakeFile('test/large/S_UICheckboxCheckmark_12_N@1x.svg');

  // Create a plugin stream
  var combiner = svgcombiner();

  // write the fake file to it
  combiner.write(medium);
  combiner.write(large);
  combiner.end();

  // wait for the file to come back out
  combiner.once('data', function(file) {
    // make sure it came out the same way it went in
    t.truthy(file.isBuffer());

    // check the contents
    t.is(format(file.contents.toString('utf8')), format(fs.readFileSync('test/CheckboxCheckmark.svg', 'utf8')));
    t.end();
  });
});

test.cb('should combine SVGs', function(t) {
  // Create the fake files
  var medium = getFakeFile('test/medium/S_UICornerTriangle_5_N@1x.svg');
  var large = getFakeFile('test/large/S_UICornerTriangle_6_N@1x.svg');

  // Create a plugin stream
  var combiner = svgcombiner({
    processName: function(filePath) {
      return 'spectrum-css-icon-' + path.basename(filePath, path.extname(filePath)).replace(/S_UI(.*?)_.*/, '$1');
    },
    processClass: function(filePath) {
      // Return the last directory
      return 'spectrum-UIIcon--' + path.dirname(filePath).split(path.sep).pop();
    }
  });

  // write the fake file to it
  combiner.write(medium);
  combiner.write(large);
  combiner.end();

  // wait for the file to come back out
  combiner.once('data', function(file) {
    // make sure it came out the same way it went in
    t.truthy(file.isBuffer());

    // check the contents
    t.is(format(file.contents.toString('utf8')), format(fs.readFileSync('test/CornerTriangle.svg', 'utf8')));
    t.end();
  });
});
