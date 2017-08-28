# Gulp CDN url append
> Find and replace all url paths on your CSS with CDN. Also append a unique token
at the end of the path. This will help you to invalidate your file on every change.


## Installation

Install via [npm](https://npmjs.org/package/gulp-cdn-url-append):

```
npm install gulp-cdn-url-append --save-dev
```

## Example

```js
const gulp = require('gulp');
const cdnAppend  = require('gulp-cdn-url-append');
const cdnUrl = 'http://my.cdn.com';

gulp.task('default', function() {
    return gulp.src('./style.css')
        .pipe(cdnAppend(cdnUrl));
});
```

> Result: `background-image: url('http://my.cdn.com/images/logo.png?cid=fkelfekflekflefke')`
## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.

## License

MIT © [Thanos Korakas](https://korakas.me)
