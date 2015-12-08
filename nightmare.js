var Nightmare = require('nightmare');
var vo = require('vo');

vo(function* () {
  var nightmare = Nightmare({
    show: true,
    width: 1024,
    height: 768
  });
  var link = yield nightmare
    .goto('http://localhost:3474')

    .wait(5000);
  yield nightmare.end();
  return link;
})(function (err, result) {
  if (err) return console.log(err);
  console.log(result);
});



//TODO сделать рендер и сохранение svg + xslt через nightmare