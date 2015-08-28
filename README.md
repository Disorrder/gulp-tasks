# gulp-tasks-mng
Manage your gulp tasks easy!
`gulp-tasks` name was busy :c

## Install
```sh
npm install --save-dev gulp-tasks-mng
```

## Get started
All examples will be wrote in CoffeeScript syntax
```coffee
gulp  = require 'gulp'
tasks = require 'gulp-tasks-mng'

tasks.add 'default', ['clean', 'compile', 'webserver']
tasks.add 'compile'

tasks.add 'async', (cb) ->
    # . . .
    tasks.get 'clean'          # you can easy find declared tasks
        .disable()             # and switch it on/off
        .excludeFrom 'default' # and even exclude from another task's dependencies
    cb()

tasks.add 'coffee', ->
    gulp.src 'src/**/*.coffee'
        .pipe coffee {bare: true}
        # . . .
.includeTo 'compile'

tasks.add 'stylus', ->
    gulp.src 'src/**/*.styl'
        .pipe stylus()
        # . . .
.include 'coffee' # add to dependencies. Run it sync after 'coffee' task
.includeTo 'compile'
```
## Tasks manager methods
All methods return Object of `Task` instance.

 - `.add(name, [deps, action])` - same syntax as `gulp.task`
 - `.get(name)` - just return task object
 - `.run(name)` - run action of task **without** dependencies

## Task methods
All methods return `this`.

 - `.include(name)` - include task to dependencies
 - `.includeTo(name)` - include this to task's dependencies
 - `.exclude(name)`
 - `.excludeFrom(name)`
 - `.enable()`
 - `.disable()`
 - `.setEnabled(bool)`
 - `.run()` - force run without dependencies, even if disabled

## TODO
More features:
 - [ ] Sync tasks syntax
 - [ ] Run tasks with dependencies

## Author notes
to publish with npm, run `npm run patch`
