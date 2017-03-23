

# Xoces

## About
Xoces is an interactive visualization library for visualizing curricular data.

Curricular data often contain many complex relationships - Xoces makes it easier to interact with and explore those relationships.

## Resources
- Visit the [MIT Mapping Lab](http://mapping.mit.edu) (our lab)
    - See guides on how to model and map curricular data, e.g. for [mapping outcomes](http://mapping.mit.edu/outcomes-mapping), [concepts](http://mapping.mit.edu/concepts-mapping), [courses in a curriculum](http://mapping.mit.edu/curriculum-mapping), etc.
- [Installing](#installing)
- [API Docs](#api)
- [Examples](#examples)

## Installing (#installing)
If you use NPM and want to require Xoces as a module:

```
npm install --save xoces
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

If you want to download the standalone bundle and load it into your HTML, this will makes the `xoces` variable globally available. If you're not sure what NPM / CommonJS / ES6 is, this option is probably for you.

```
<html>
  <body>

  <script src="https://xoces-v2.0.0.min.js"></script>
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
<script src="https://cdnjs.org/xoces-v2.0.0.min.js"></script>
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
  entityLabelKey: 'name',
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
- Institution
  - School
    - Department
      - Course
```
Your hierarchy array would then be:
```
['institution', 'school', 'department', 'course']
```

## Pull requests
Please contribute! We respond within 24 hours.    

## Dependencies
Xoces comes bundled with [lodash](lodash.com/docs/4.17.4#at), [d3](https://github.com/d3/d3), [jquery](https://github.com/jquery/jquery), [chroma-js](https://github.com/gka/chroma.js/), [react]() and [redux]().

For the vast majority of users, this is fine. But if you want to load your own versions of this libraries,
