const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const emailRouter = require("./email/email.route");
const smsRouter = require("./sms/sms.route");
const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb', extended: true }));

// Request mapping
app.use("/api/v1/email", emailRouter);
app.use("/api/v1/sms", smsRouter);

// Console output coloring
app.use(morgan("dev"));

// Print all mapped request
function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))

const server = app.listen(port, function () {
  console.log('Express server listening on port ', server.address().port, " with pid ", process.pid);
});
