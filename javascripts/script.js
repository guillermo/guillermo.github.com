(function() {
  var GET, add_link, clear_links, find, save, tumblr, twitter;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  GET = function(url, fn) {
    var char, data, jsonp_url, name, script, _ref;
        if ((_ref = window.jsonp_requests) != null) {
      _ref;
    } else {
      window.jsonp_requests = 1;
    };
    name = "jsonp_request_" + window.jsonp_requests++;
    this.self = this;
    window[name] = __bind(function(data) {
      save(url, data);
      return fn(data);
    }, this);
    data = find(url);
    if (data != null) {
      fn(data);
    }
    if (url.indexOf("?") < 0) {
      char = "?";
    } else {
      char = "&";
    }
    jsonp_url = "" + url + char + "callback=" + name;
    script = document.createElement('scr' + 'ipt');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', jsonp_url);
    return document.getElementsByTagName('head')[0].appendChild(script);
  };
  add_link = function(id, url, text) {
    var a, li, ul;
    if (ul = document.getElementById(id)) {
      a = document.createElement('a');
      a.innerText = text;
      a.setAttribute('href', url);
      li = document.createElement('li');
      li.appendChild(a);
      return ul.appendChild(li);
    }
  };
  clear_links = function(id) {
    var child, ul, _i, _len, _ref, _results;
    ul = document.getElementById(id);
    if ((ul != null) && ul.hasChildNodes()) {
      _ref = ul.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(ul.removeChild(child));
      }
      return _results;
    }
  };
  save = function(key, value) {
    if (window.localStorage != null) {
      return localStorage[key] = JSON.stringify(value);
    }
  };
  find = function(key) {
    var value;
    value = null;
    if (window.localStorage != null) {
      try {
        value = JSON.parse(localStorage[key]);
      } catch (error) {
        window.console.debug(error);
      }
    }
    return value;
  };
  tumblr = function(data) {
    var field, note, _i, _len, _ref, _results;
    if (data == null) {
      return;
    }
    clear_links("notes");
    _ref = data["posts"].slice(0, 3);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      note = _ref[_i];
      field = (function() {
        switch (note.type) {
          case "regular":
          case "conversation":
          case "video":
            return 'title';
          case "photo":
          case "audio":
            return 'caption';
          case "quote":
            return 'quote';
          case "link":
            return 'text';
        }
      })();
      field = "" + note.type + "-" + field;
      _results.push(add_link("notes", "http://mininotas.cientifico.net/posts/" + note['id'], note[field]));
    }
    return _results;
  };
  twitter = function(data) {
    var tweet, _i, _len, _results;
    if (data == null) {
      return;
    }
    clear_links("tweets");
    _results = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      tweet = data[_i];
      _results.push(add_link("tweets", "http://twitter.com/#!/guillermooo/status/" + tweet.id_str, tweet.text));
    }
    return _results;
  };
  GET("http://mininotas.cientifico.net/api/read/json", tumblr);
  GET("http://twitter.com/status/user_timeline/guillermooo.json?count=3", twitter);
}).call(this);
