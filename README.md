
# Xoces
![Xoces: Chord & Tree visualization widget](https://github.com/wombats-writing-code/xoces/img/xoces-chord-tree.png)


## What and why
Xoces is an interactive visualization tool for visualizing data that have both hierarchical levels and also relationships 'within the same level'. For example, you have learning outcomes grouped into subjects and you want to visualize how your outcomes relate to each other. Or you have actors and movies grouped by A/B/C/D-lists and you want to see how those all relate to each other.

**Why use Xoces**
We want to save people time by providing a neat but powerful, configurable visualization that works more or less out of the box. You could code it from scratch from d3, but we think you'll find the API pretty easy to use.


## Resources
- Visit the [MIT Mapping Lab](http://mapping.mit.edu) (our lab)
    - See guides on how to model and map curricular data, e.g. for [mapping outcomes](http://mapping.mit.edu/outcomes-mapping), [concepts](http://mapping.mit.edu/concepts-mapping), [courses in a curriculum](http://mapping.mit.edu/curriculum-mapping), etc.
- [Installing](#installing)
- [Getting started](#getting-started)
- [API Docs](#api)
- [Examples](#examples)

## Installing
If you use NPM and want to require Xoces as a module:

```
npm install --save xoces
```

Xoces has dependencies and needs these dependencies to be installed and `require`'d into your environment:
```
npm --save jquery react react-dom redux react-redux
```

To require Xoces in your ES6:
```
import xoces from 'xoces'
```

Alternatively, if you use CommonJS module style, you can do:
```
var xoces = require('xoces')
```

### UMD

If you use the UMD bundle, everything is bundled along with you, so you don't need to install dependencies and can just do:
```
import xoces from 'xoces/xoces-umd'
```

If you want to [download the standalone bundle](http://github.com/wombats-writing-code/xoces/dist/xoces-umd.js) and load it into your HTML, this will makes the `xoces` variable globally available. If you're not sure what NPM / CommonJS / ES6 is, this option is probably for you.

```
<html>
  <body>

  <script src="/scripts/xoces-umd.js"></script>
  <script>
    console.log('xoces is loaded!', xoces);
    var config = {...};
    var myWidget = xoces.widgets.ChordWidget.new(config);
  </script>
  </body>
</html>

```

### CDN

You can also load it directly from CDN:
```
<script src="https://cdnjs.org/xoces-v2.0.0.umd.min.js"></script>
```

## Getting started

Xoces lets you choose from 3 widgets: `XocesWidget`, `ChordWidget`, or `TreeWidget`.

The `ChordWidget` gets you the chord visualization.
![chord visualization](https://github.com/wombats-writing-code/xoces/img/xoces-chord-widget.png)


The `TreeWidget` gives you the tree visualization:
![tree visualization](https://github.com/wombats-writing-code/xoces/img/xoces-tree-widget.png)

The `XocesWidget` gets you the chord and tree visualization.
![tree visualization](https://github.com/wombats-writing-code/xoces/img/xoces-widget.png)

To initialize a widget, call:
```
var myWidget = xoces.widgets.ChordWidget.new({});
```




## API

**xoces.widgets.ChordWidget()**

The first step is to create a widget by passing in a **config** object.
```
var myWidget = xoces.widgets.ChordWidget.new(config);
```

**widget.render()**

Calling this method renders the widget onto screen. This method expects the id of the container element that wraps the widget. If the name you provided is not found, it will create an element and

```
myWidget.render({
  container: string
})
```

**configuration**

The config argument passed into `xoces.widgets.ChordWidget(config)` is an object with these fields (and their default values):

```
var config = {
  data: {
    entities: [Entity],                  // required!
    relationships: [Relationship]         
  },
  hierarchy: [],                         // required!
  currentLevelEntity: null,
  entityLabelKey: '',                    // required!
  relationship: {
    parentType: '',                      // required!
    sourceRef: '',                       // required!
    targetRef: '',                       // required!
  },
  width: '100%',
  height: 500,
  colorScheme: 'dark',                  // 'light' or 'dark'
  onMouseOver: function() {},
  onMouseOut: function() {},
  onClick: function() {}
}
```

Read more below on each field.

**configuration.data**

This field is an object with 2 fields: `entities` and `relationships`. `entities` must be an array of Entity objects (see below for more detail), and `relationships` must be an array of Relationship objects.

**configuration.data.Entity**

An `Entity` object is just a plain-old JavaScript object, with two mandatory properties: `id` and `type`. The `id` field is a unique identifier for the entity and must not be repeated. The `type` field specifies what type of entity it is.

For example, this is a valid entity:

```
var validEntity = {
  id: 'entity1',
  type: 'course',
  someOtherProperty: 'hello world!'
}
```
**configuration.data.Relationship**

A `Relationship` object is also just a plain-old JavaScript object, with three mandatory properties: `type`, `sourceId`, `targetId`.


**configuration.hierarchy**

This field is **required**. This is an array of the types of entities, ordered by increasing granularity. This specifies how your entities are supposed to be nested. For example, your data model may look like:
```
- institution
  - school
    - department
      - course
```
Your hierarchy array would then be:
```
['institution', 'school', 'department', 'course']
```

## Examples

In the `dist/` folder, there are 3 examples that are loaded into `dist/index.html`:
* `example1.js`: Uses a made-up data set
* `example2.js`: Uses the Singapore University of Technology & Design core curriculum dataset. Check out the [interactive visualization here](http://localhost:5000/projects/xoces-examples#sutdoces).
* `example3.js`: Uses a subset of the Massachusetts Institute of Technology outcomes mapping dataset. Check out the [interactive visualization here](http://localhost:5000/projects/xoces-examples#mitoces)

## Pull requests
Please contribute! We respond within 24 hours.

## Feedback

Contact us at the [MIT Mapping Lab](http://mapping.mit.edu) [mapping at mit.edu]
