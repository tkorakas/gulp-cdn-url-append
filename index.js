const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const md5 = require('md5');
const replace = require('replacestream');
const PLUGIN_NAME = 'gulp-cdn-url-append';

var cdnUrl;

function gulpCdnUrlAppend(cdn) {
    if (!cdn) {
        throw new PluginError(PLUGIN_NAME, 'Missing CDN URL!');
    }
    cdnUrl = cdn;

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }

        // Handle stream and buffer.
        if (file.isStream()) {
            file.contents = file.contents.pipe(replace(/url\((.*?)\)/ig, addCDNToPath));
        } else if (file.isBuffer()) {
            file.contents = new Buffer(String(file.contents).replace(/url\((.*?)\)/ig, addCDNToPath));
        }

        return cb(null, file);
    });
}

function addCDNToPath(result) {
    // Replace double quotes with single and then split every single quote.
    const urlParts = result.split('"').join('\'').split('\'');

    // Append unique hash to invalidate file.
    const uniqueHash = md5(urlParts[1] + Date.now());
    return `${urlParts[0]}'${cdnUrl}${urlParts[1]}?cid=${uniqueHash}'${urlParts[2]}`;
}

// Exporting the plugin main function
module.exports = gulpCdnUrlAppend;
