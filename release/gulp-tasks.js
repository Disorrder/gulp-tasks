// Generated by CoffeeScript 1.9.3
var Lib, Task, _, colors, gulp, k, v;

gulp = require('gulp');

colors = require('colors');

_ = require('lodash');

Function.argumentsNames = function(f) {
  var FN_ARGS, FN_ARG_SPLIT, STRIP_COMMENTS, STRIP_SPACES;
  FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  FN_ARG_SPLIT = /,/;
  STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  STRIP_SPACES = /\s+/g;
  if (typeof f === 'function') {
    return f.toString().replace(STRIP_COMMENTS, '').match(FN_ARGS)[1].replace(STRIP_SPACES, '').split(FN_ARG_SPLIT).filter((function(_this) {
      return function(v) {
        return v;
      };
    })(this));
  } else {
    return null;
  }
};

Task = (function() {
  Task.prototype.enabled = true;

  Task.prototype.task = null;

  Task.prototype.refresh = function() {
    var args, d, dependencies, i, len, ref, taskFn, taskRunner;
    dependencies = [];
    ref = this.dependencies;
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      if (!Lib.list[d] || Lib.list[d].enabled) {
        dependencies.push(d);
      }
    }
    taskFn = (function(_this) {
      return function() {
        if (_this.enabled) {
          return typeof _this.action === "function" ? _this.action(arguments[0]) : void 0;
        } else {
          return gulp.log(("Task " + name + " is disabled").yellow);
        }
      };
    })(this);
    args = Function.argumentsNames(this.action);
    taskRunner = (args != null ? args.length : void 0) ? (function(_this) {
      return function(cb) {
        return taskFn(cb);
      };
    })(this) : (function(_this) {
      return function() {
        return taskFn();
      };
    })(this);
    this.task = gulp.task(this.name, dependencies, taskRunner);
    return this;
  };

  function Task(name1, dependencies1, action1) {
    this.name = name1;
    this.dependencies = dependencies1;
    this.action = action1;
    this.refresh();
  }

  Task.prototype.include = function(name) {
    this.dependencies.push(name);
    return this.refresh();
  };

  Task.prototype.includeTo = function(name) {
    Lib.get(name).include(this.name);
    return this;
  };

  Task.prototype.exclude = function(name) {
    _.without(this.dependencies, name);
    return this.refresh();
  };

  Task.prototype.excludeFrom = function(name) {
    Lib.get(name).exclude(this.name);
    return this;
  };

  Task.prototype.setEnabled = function(cond) {
    if (cond == null) {
      cond = false;
    }
    this.enabled = !!cond;
    return this;
  };

  Task.prototype.disable = function() {
    return this.setEnabled(false);
  };

  Task.prototype.enable = function() {
    return this.setEnabled(true);
  };

  Task.prototype.run = function() {
    if (this.action) {
      this.action();
    } else {
      util.log("Task " + this.name + " have no action, can't run");
    }
    return this;
  };

  return Task;

})();

Lib = (function() {
  function Lib() {}

  Lib.list = {};

  Lib.add = function(name, dependencies, action) {
    if (dependencies == null) {
      dependencies = [];
    }
    if (typeof dependencies === 'function') {
      action = dependencies;
      dependencies = [];
    }
    if (!Array.isArray(dependencies)) {
      dependencies = [dependencies];
    }
    return Lib.list[name] = new Task(name, dependencies, action);
  };

  Lib.get = function(name) {
    return Lib.list[name];
  };

  Lib.refresh = function() {
    var name, ref, results, task;
    ref = Lib.list;
    results = [];
    for (name in ref) {
      task = ref[name];
      results.push(task.refresh());
    }
    return results;
  };

  Lib.run = function(name) {
    var task;
    task = Lib.get(name);
    task.run();
    return task;
  };

  return Lib;

})();

for (k in Lib) {
  v = Lib[k];
  exports[k] = v;
}
