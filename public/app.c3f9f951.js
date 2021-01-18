// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/content.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Content = void 0;

var _list = require("./list.js");

class Content {
  constructor(container, post) {
    this.container = container;
    this.post = post;
    this.url = '/api/data';
    this.modal = new bootstrap.Modal(document.querySelector('.modal'));
    this.data = {};
    this.listContainer = document.querySelector('.list');
    this.init();
  }

  init() {
    this.getData();
  }

  render(item) {
    if (this.container.lastElementChild.classList.contains('btn')) {
      this.container.lastElementChild.remove();
      this.container.lastElementChild.remove();
    }

    this.container.classList.remove('post-no-display');
    this.container.firstElementChild.innerHTML = `
          <p>${item.title}</p>
          <p>${item.date}</p>
        `;
    this.container.lastElementChild.innerHTML = `
          <p>${item.content}</p>
        `;
    const editButton = document.createElement('button');
    editButton.textContent = 'Реадктировать';
    editButton.classList.value = 'btn btn-primary edit-content';
    editButton.dataset.id = this.post.id;
    this.container.append(editButton);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.classList.value = 'btn btn-danger delete-content';
    deleteButton.id = this.post.id;
    this.container.append(deleteButton);
    this.listenEditPost();
    this.listenDeletePost();
  }

  getData() {
    return fetch(this.url, {
      method: 'GET'
    }).then(response => response.json()).then(data => {
      data.list.forEach(element => {
        if (element.id === this.post.id) {
          this.render(element);
          this.data = element;
        }
      });
    });
  }

  listenEditPost() {
    document.querySelector('.edit-content').addEventListener('click', () => {
      this.modal._element.dataset.method = 'PUT';
      document.querySelector('#postHeader').value = this.data.title;
      document.querySelector('#postContent').value = this.data.content;
      document.querySelector('#metaId').value = this.data.id;
      document.querySelector('#metaDate').value = this.data.date;
      this.modal.show();
    });
  }

  listenDeletePost() {
    document.querySelector('.delete-content').addEventListener('click', e => {
      const id = e.target.id;
      const toDelete = confirm('Вы действительно хотите удалить пост?');

      if (toDelete) {
        this.deletePost(id);
      }
    });
  }

  deletePost(id) {
    return fetch(this.url + `/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }).then(response => response.json()).then(data => new _list.List(this.listContainer, data.list)).catch(error => console.error(error));
  }

}

exports.Content = Content;
},{"./list.js":"js/list.js"}],"js/list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = void 0;

var _content = require("./content.js");

class List {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.ulr = '/api/data';
    this.init();
  }

  init() {
    this.render();
    this.listenShowContent();
  }

  render() {
    this.container.innerHTML = '';
    this.data.forEach(element => {
      const listItem = document.createElement('li');
      listItem.id = element.id;
      listItem.innerHTML = `
      <p>${element.title}</p>
      <p>${element.date}</p>
      `;
      listItem.classList.add('list-item');
      this.container.append(listItem);
    });
  }

  showContent(item) {
    const container = document.querySelector('.post');
    const content = new _content.Content(container, item);
  }

  showActiveItem(item) {
    if (document.querySelector('.active-item')) {
      document.querySelector('.active-item').classList.remove('active-item');
      item.classList.add('active-item');
    } else {
      item.classList.add('active-item');
    }
  }

  listenShowContent() {
    this.container.addEventListener('click', e => {
      if (e.target.classList.contains('list-item')) {
        this.showActiveItem(e.target);
        this.showContent(e.target);
      }
    });
  }

}

exports.List = List;
},{"./content.js":"js/content.js"}],"js/form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _list = require("./list");

class Form {
  constructor(form) {
    this.form = form;
    this.url = '/api/data';
    this.init();
    this.listContainer = document.querySelector('.list');
  }

  init() {
    this.listenSubmitForm();
  }

  listenSubmitForm() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const data = {};
      const isValid = this.form.checkValidity();

      if (!isValid) {
        this.form.classList.add('check-valid');
      } else {
        this.form.classList.remove('check-valid');

        if (document.querySelector('.modal').dataset.method === 'POST') {
          const currentDate = new Date();
          this.setMetaData(+currentDate, this.formatDate(currentDate));
        }

        const formData = new FormData(this.form);
        formData.forEach((value, key) => {
          data[key] = value;
        });

        this._send(data);

        this.form.reset();
      }
    });
  }

  _send(data) {
    let method = document.querySelector('.modal').dataset.method;
    let url = '';
    method === 'POST' ? url = this.url : url = this.url + `/${data.id}`;
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).then(data => new _list.List(this.listContainer, data.list)).catch(error => console.error(error));
  }

  formatDate(date) {
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    const result = `${day}.${month}.${year}  ${hours}:${minutes}`;
    return result;
  }

  setMetaData(id, date) {
    document.querySelector('#metaId').value = id;
    document.querySelector('#metaDate').value = date;
  }

}

exports.Form = Form;
},{"./list":"js/list.js"}],"js/app.js":[function(require,module,exports) {
"use strict";

var _form = require("./form.js");

document.querySelector('#openModal').addEventListener('click', () => {
  document.querySelector('.modal').dataset.method = 'POST';
});
const formEl = document.querySelector('#addPost');
const form = new _form.Form(formEl);
},{"./form.js":"js/form.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50825" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=app.c3f9f951.js.map