gulp        = require 'gulp'
colors      = require 'colors'
_           = require 'lodash'

# --- Expand Function ---
Function.argumentsNames = (f) ->
    # From Angular injector
    FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
    FN_ARG_SPLIT = /,/
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
    STRIP_SPACES   = /\s+/g

    if typeof f == 'function'
        return f.toString()
            .replace(STRIP_COMMENTS, '')
            .match(FN_ARGS)[1]
            .replace(STRIP_SPACES, '')
            .split(FN_ARG_SPLIT)
            .filter((v) => return v)
    else
        return null

# TODO sync flow dependencies like gulp-sync / run-sequence

class Task
    enabled: true
    task: null # Gulp task

    refresh: ->
        dependencies = []
        dependencies.push d for d in @dependencies when !Lib.list[d] or Lib.list[d].enabled #when: not exist tasks will throw error, disabled tasks will not write log

        taskFn = () => if @enabled then @action?(arguments[0]) else gulp.log "Task #{name} is disabled".yellow
        args = Function.argumentsNames @action
        taskRunner = if args?.length then (cb) => taskFn(cb) else () => taskFn()

        @task = gulp.task @name, dependencies, taskRunner
        # gulp parses arguments and doesn't finish task if cb is defined there. Therefore cb = arguments[0]
        @

    constructor: (@name, @dependencies, @action) ->
        @refresh()

    include: (name) ->
        @dependencies.push name
        @refresh()

    includeTo: (name) ->
        Lib.get(name).include @name
        @

    exclude: (name) ->
        _.without @dependencies, name
        @refresh()

    excludeFrom: (name) ->
        Lib.get(name).exclude @name
        @

    setEnabled: (cond = false) ->
        @enabled = !!cond
        @

    disable: -> @setEnabled false
    enable:  -> @setEnabled true

    run: ->
        if @action then @action() else util.log "Task #{@name} have no action, can't run"
        @

class Lib # exports interface
    # @initGulp: (gulpPtr) -> gulp = gulpPtr #?
    @list: {}

    @add: (name, dependencies = [], action) =>
        if typeof dependencies == 'function'
            action = dependencies
            dependencies = []
        if !Array.isArray dependencies then dependencies = [dependencies]
        @list[name] = new Task name, dependencies, action

    @get: (name) => @list[name]

    @refresh: =>
        for name, task of @list
            task.refresh()

    @run: (name) => # without deps
        task = @get name
        task.run()
        task

# --- exports ---
for k, v of Lib
    exports[k] = v
