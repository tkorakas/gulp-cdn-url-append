'use strict';

const assert = require('assert');
const es = require('event-stream');
const gutil = require('gulp-util');
const PassThrough = require('stream').PassThrough;
const cdnReplace = require('./index');
const fs = require('fs');

const fakeImageResult = 'http://fake.cdn.com/images/fake-image.jpg?cid=';
const fakeImage2Result = 'http://fake.cdn.com/images/fake-image-2.jpg?cid=';

const contents = fs.readFileSync('./test.css', 'utf8');

describe('gulp-cdn-url-replace', function () {
    it('should work in buffer mode', function (done) {
        var stream = cdnReplace('http://fake.cdn.com');
        var fakeBuffer = new Buffer(contents);
        var fakeFile = new gutil.File({
            contents: fakeBuffer
        });

        stream.on('data', function (newFile) {
            assert(String(newFile.contents).includes(fakeImageResult), 'Image 1 replaced');
            assert(String(newFile.contents).includes(fakeImage2Result), 'Image 2 replaced');
        });

        stream.on('end', function () {
            done();
        });

        stream.write(fakeFile);
        stream.end();
    });

    it('should work in stream mode', function (done) {
        var stream = cdnReplace('http://fake.cdn.com');
        var fakeStream = new PassThrough();
        var fakeFile = new gutil.File({
            contents: fakeStream
        });
        fakeStream.write(new Buffer(`body {background-image: `));
        fakeStream.write(new Buffer(`url('/images/fake-image.jp`));
        fakeStream.write(new Buffer(`g');}`));
        fakeStream.write(new Buffer(`.fake-class {background-image: url("/images/fake-image-2.jpg");}`));
        fakeStream.end();

        stream.on('data', function (newFile) {
            newFile.pipe(es.wait(function (err, data) {
                assert(String(data).includes(fakeImageResult), 'Image 1 replaced');
                assert(String(newFile.contents).includes(fakeImage2Result), 'Image 2 replaced');
            }));
        });

        stream.on('end', function () {
            done();
        });

        stream.write(fakeFile);
        stream.end();
    });

    it('should let null files pass through', function (done) {
        var stream = cdnReplace('http://fake.cdn.com'),
            n = 0;
        stream.pipe(es.through(function (file) {
            assert.equal(file.path, 'null.md');
            assert.equal(file.contents, null);
            n++;
        }, function () {
            assert.equal(n, 1);
            done();
        }));
        stream.write(new gutil.File({
            path: 'null.md',
            contents: null
        }));
        stream.end();
    });
});
