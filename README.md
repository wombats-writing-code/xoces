
# Xoces
![Xoces: Chord & Tree visualization widget](https://github.com/wombats-writing-code/xoces/blob/master/img/xoces-chord-tree.png)

![Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/41.0.0/archive/chrome_1-11/chrome_1-11_24x24.png) | ![Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/41.0.0/archive/firefox_1.5-3/firefox_1.5-3_24x24.png) | ![IE](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/41.0.0/archive/internet-explorer_6/internet-explorer_6_24x24.png) | ![Edge](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/41.0.0/edge-tile/edge-tile_24x24.png) | ![Safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/41.0.0/archive/safari_1-7/safari_1-7_24x24.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 10+ ✔ | Latest ✔ | 6.1+ ✔ |

## What and why
Xoces is a JavaScript widget for visualizing data that have both hierarchical levels and also relationships "within the same level". For example, you have learning outcomes grouped into subjects and you want to visualize how your outcomes relate to each other. Or you have actors and movies grouped by A/B/C/D-lists and you want to see how those all relate to each other.

**Why use Xoces**
We want to save people time by providing a neat but powerful, configurable visualization that works more or less out of the box. You could code it from scratch from d3, but we think you'll find the API pretty easy to use. Just include the widget in your code or HTML, specify your data, and you're good to go.

See what the visualization looks like -- we have a [few demos here](http://mapping.mit.edu/projects/xoces-examples).


## Resources
- Visit the [MIT Mapping Lab](http://mapping.mit.edu) (the people who made xoces)
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
import xoces from 'xoces/umd/xoces-umd'
```

If you want to [download the standalone bundle](http://github.com/wombats-writing-code/xoces/dist/umd/xoces-umd.js) and load it into your HTML, this will makes the `xoces` variable globally available. If you're not sure what NPM / CommonJS / ES6 is, this option is probably for you.

```
<html>
  <body>

  <script src="/scripts/xoces-umd.js"></script>
  <script>
    console.log('xoces is loaded!', xoces);
    var config = {...};
    var myWidget = xoces.widgets.XocesWidget.new(config);
  </script>
  </body>
</html>

```

### CDN

You can also load it directly from CDN:
```
<!-- Loading a fixed version, e.g. 1.1.51 -->
<script src="https://unpkg.com/xoces@1.1.51/umd/xoces-umd.js"></script>

<!-- or load the latest  -->
<script src="https://unpkg.com/xoces/umd/xoces-umd.js"></script>
```

## Getting started

Xoces lets you choose from 3 widgets: `XocesWidget`, `ChordWidget`, or `TreeWidget`.

The `ChordWidget` gets you the chord visualization.
![chord visualization](https://github.com/wombats-writing-code/xoces/blob/master/img/xoces-chord-widget.png)

The chord component visualizes one level of the hierarchy at one time. Whenever you click on a piece, the chord visualization changes to display the next level down. Confused? Take some time to [explore our examples](http://mapping.mit.edu/projects/xoces-examples) and keep reading to see what "hierarchy" means.

The `TreeWidget` gives you the tree visualization:
![tree visualization](https://github.com/wombats-writing-code/xoces/blob/master/img/xoces-tree-widget.png)

The tree component computes a rank for each entity and arranges them in order of increasing rank. So, the top-most entity is the "beginning" and the bottom-most entity has the "most things going into it".

The `XocesWidget` gets you the chord and tree visualization by displaying entities in tree view when you're at the bottom of the hierarchy.
![chord-tree visualization](https://github.com/wombats-writing-code/xoces/blob/master/img/xoces-chord-tree-widget.png)

To initialize a widget, call:
```
var myWidget = xoces.widgets.XocesWidget.new({});
```

Of course this doesn't quite work -- if you inspect the console, xoces tells you that you're missing **mandatory** configuration settings. At minimum, you need to specify:
```
var myWidget = xoces.widgets.XocesWidget.new({

  // in this made-up example, we have a top level group. Within this top-level group, we have smaller groups.
  // ...within groups, we have teams. Within a team, we have people.
  hierarchy: ['top-level-group', 'group', 'team', 'person'],     
  data: {
    entities: [

      // let's start with two entities. 'id' and 'type' fields are mandatory.
      {
        id: 'entity1',
        type: 'top-level-group',
        nameForDisplay: 'i am the first entity'
      },
      {
        id: 'entity2',
        type: 'group',
        nameForDisplay: 'another entity'
      },
    ],
    relationships: [

      // this relationship points from entity2 ---> entity1, saying that entity2 'has_parent_of' entity1
      {               
        id: 'r1',
        type: 'has_parent_of',
        sourceId: 'entity2',
        parentId: 'entity1'
      }
    ]
  },

  // we choose the key 'nameForDisplay' for displaying the entity
  entityLabelKey: 'nameForDisplay',

  // we tell xoces that grouping relationships have type 'has_parent_of'
  // and that relationships have keys 'sourceId' and 'targetId' that point to the source and target respectively
  relationship: {
    parentType: 'has_parent_of',
    sourceRef: 'sourceId',
    targetRef: 'targetId',
  },
});
```


## API

**xoces.widgets.XocesWidget()**

The first step is to create a widget by passing in a **config** object.
```
var myWidget = xoces.widgets.XocesWidget.new(config);
```

**widget.render()**

Calling this method renders the widget onto screen. This method expects either the container or the id of the container element that wraps the widget. If the name you provided is not found, it will create an element and append it to the body. We recommend you always specify a container.

```
myWidget.render({
  container: string
})
```

**configuration**

The config argument passed into `xoces.widgets.XocesWidget(config)` is an object with these fields (and their default values):

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

**configuration.data.entities**

An `Entity` object is just a plain-old JavaScript object, with two mandatory properties: `id` and `type`. The `id` field is a unique identifier for the entity and must not be repeated. The `type` field specifies what type of entity it is.

For example, this is a valid entity:

```
var validEntity = {
  id: 'entity1',
  type: 'course',
  someOtherProperty: 'hello world!'
}
```
**configuration.data.relationships**

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

**configuration.colorScheme**
`'light'` or `dark`. The light scheme works better for print outs, while the dark scheme looks better for presentations.

**configuration.width**
Sets the width of the entire widget.

**configuration.height**
Sets the height of the entire widget. We recommend at least a `500`px height.

## Examples

In the `dist/` folder, there are 3 examples that are loaded into `dist/index.html`:
* `example1.js`: Uses a made-up data set
* `example2.js`: Uses the Singapore University of Technology & Design core curriculum dataset. A smaller data set of hundreds of outcomes -- [interactive visualization](http://mapping.mit.edu/projects/xoces-examples?name=sutdoces).
* `example3.js`: Uses a subset of the Massachusetts Institute of Technology outcomes mapping dataset. This data set has thousands of outcomes -- [interactive visualization](http://mapping.mit.edu/projects/xoces-examples?name=mitoces)

## Pull requests and bugs
Please contribute or file requests! We respond within 24 hours.

## Feedback

Contact us at the [MIT Mapping Lab](http://mapping.mit.edu) [mapping-lab at mit.edu]
