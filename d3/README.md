# D3: Data-Driven Documents

<a href="https://d3js.org"><img src="https://d3js.org/logo.svg" align="left" hspace="10" vspace="6"></a>

**D3** (or **D3.js**) is a JavaScript library for visualizing data using web standards. D3 helps you bring data to life using SVG, Canvas and HTML. D3 combines powerful visualization and interaction techniques with a data-driven approach to DOM manipulation, giving you the full capabilities of modern browsers and the freedom to design the right visual interface for your data.

Want to learn more? [See the wiki.](https://github.com/d3/d3/wiki)

For examples, [see the gallery](https://github.com/d3/d3/wiki/Gallery) and [mbostock’s bl.ocks](http://bl.ocks.org/mbostock).

## Installing

The master branch currently contains the prerelease of D3 4.0. The 4.0 API is not yet frozen and may change prior to the release. (For the latest stable release, 3.5.17, follow the [installation instructions](https://github.com/d3/d3/wiki#installing) on the wiki.) If you use NPM, `npm install d3@next`. Otherwise, download the [latest release](https://npmcdn.com/d3@next/build/). The released bundle supports AMD, CommonJS, and vanilla environments. Create a [custom bundle using Rollup](http://bl.ocks.org/mbostock/bb09af4c39c79cffcde4) or your preferred bundler. You can also load directly from [d3js.org](https://d3js.org):

```html
<script src="https://d3js.org/d3.v4.0.0-alpha.49.min.js"></script>
```

For the non-minified version, remove `.min` from the file name.

## API Reference

D3 4.0 is a [collection of modules](https://github.com/d3) that are designed to work together; you can use the modules independently, or you can use them together as part of the default build. The source and documentation for each module is available in its repository. Follow the links below to learn more. For an overview of changes between D3 3.x and 4.0, see [CHANGES](https://github.com/d3/d3/blob/master/CHANGES.md).

* [Arrays](#arrays-d3-array) ([Statistics](#statistics), [Histograms](#histograms), [Search](#search), [Transformations](#transformations))
* [Axes](#axes-d3-axis)
* [Brushes](#brushes-d3-brush)
* [Collections](#collections-d3-collection) ([Objects](#objects), [Maps](#maps), [Sets](#sets), [Nests](#nests))
* [Colors](#colors-d3-color)
* [Delimiter-Separated Values](#delimiter-separated-values-d3-dsv)
* [Dispatches](#dispatches-d3-dispatch)
* [Dragging](#dragging-d3-drag)
* [Easings](#easings-d3-ease)
* [Forces](#forces-d3-force)
* [Hierarchies](#hierarchies-d3-hierarchy)
* [Interpolators](#interpolators-d3-interpolate)
* [Number Formats](#number-formats-d3-format)
* [Paths](#paths-d3-path)
* [Polygons](#polygons-d3-polygon)
* [Quadtrees](#quadtrees-d3-quadtree)
* [Queues](#queues-d3-queue)
* [Random Numbers](#random-numbers-d3-random)
* [Requests](#requests-d3-request)
* [Scales](#scales-d3-scale) ([Continuous](#continuous-scales), [Sequential](#sequential-scales), [Quantize](#quantize-scales), [Ordinal](#ordinal-scales))
* [Selections](#selections-d3-selection) ([Selecting](#selecting-elements), [Modifying](#modifying-elements), [Data](#joining-data), [Events](#handling-events), [Control](#control-flow), [Local Variables](#local-variables), [Namespaces](#namespaces))
* [Shapes](#shapes-d3-shape) ([Arcs](#arcs), [Pies](#pies), [Lines](#lines), [Areas](#areas), [Curves](#curves), [Symbols](#symbols), [Stacks](#stacks))
* [Time Formats](#time-formats-d3-time-format)
* [Time Intervals](#time-intervals-d3-time)
* [Timers](#timers-d3-timer)
* [Transitions](#transitions-d3-transition)
* [Voronoi Diagrams](#voronoi-diagrams-d3-voronoi)
* [Zooming](#zooming-d3-zoom)

D3 uses [semantic versioning](http://semver.org/). The current version is exposed as d3.version.

## [Arrays (d3-array)](https://github.com/d3/d3-array)

Array manipulation, ordering, searching, summarizing, etc.

#### [Statistics](https://github.com/d3/d3-array#statistics)

Methods for computing basic summary statistics.

* [d3.min](https://github.com/d3/d3-array#min) - compute the minimum value in an array.
* [d3.max](https://github.com/d3/d3-array#max) - compute the maximum value in an array.
* [d3.extent](https://github.com/d3/d3-array#extent) - compute the minimum and maximum value in an array.
* [d3.sum](https://github.com/d3/d3-array#sum) - compute the sum of an array of numbers.
* [d3.mean](https://github.com/d3/d3-array#mean) - compute the arithmetic mean of an array of numbers.
* [d3.median](https://github.com/d3/d3-array#median) - compute the median of an array of numbers (the 0.5-quantile).
* [d3.quantile](https://github.com/d3/d3-array#quantile) - compute a quantile for a sorted array of numbers.
* [d3.variance](https://github.com/d3/d3-array#variance) - compute the variance of an array of numbers.
* [d3.deviation](https://github.com/d3/d3-array#deviation) - compute the standard deviation of an array of numbers.

#### [Histograms](https://github.com/d3/d3-array#histograms)

Bin discrete samples into continuous, non-overlapping intervals.

* [d3.histogram](https://github.com/d3/d3-array#histogram) - create a new histogram generator.
* [*histogram*](https://github.com/d3/d3-array#_histogram) - compute the histogram for the given array of samples.
* [*histogram*.value](https://github.com/d3/d3-array#histogram_value) - specify a value accessor for each sample.
* [*histogram*.domain](https://github.com/d3/d3-array#histogram_domain) - specify the interval of observable values.
* [*histogram*.thresholds](https://github.com/d3/d3-array#histogram_thresholds) - specify how values are divided into bins.
* [d3.thresholdFreedmanDiaconis](https://github.com/d3/d3-array#thresholdFreedmanDiaconis) - the Freedman–Diaconis binning rule.
* [d3.thresholdScott](https://github.com/d3/d3-array#thresholdScott) - Scott’s normal reference binning rule.
* [d3.thresholdSturges](https://github.com/d3/d3-array#thresholdSturges) - Sturges’ binning formula.

#### [Search](https://github.com/d3/d3-array#search)

Methods for searching arrays for a specific element.

* [d3.scan](https://github.com/d3/d3-array#scan) - linear search for an element using a comparator.
* [d3.bisect](https://github.com/d3/d3-array#bisect) - binary search for a value in a sorted array.
* [d3.bisectRight](https://github.com/d3/d3-array#bisectRight) - binary search for a value in a sorted array.
* [d3.bisectLeft](https://github.com/d3/d3-array#bisectLeft) - binary search for a value in a sorted array.
* [d3.bisector](https://github.com/d3/d3-array#bisector) - bisect using an accessor or comparator.
* [*bisector*.left](https://github.com/d3/d3-array#bisector_left) - bisectLeft, with the given comparator.
* [*bisector*.right](https://github.com/d3/d3-array#bisector_right) - bisectRight, with the given comparator.
* [d3.ascending](https://github.com/d3/d3-array#ascending) - compute the natural order of two values.
* [d3.descending](https://github.com/d3/d3-array#descending) - compute the natural order of two values.

#### [Transformations](https://github.com/d3/d3-array#transformations)

Methods for transforming arrays and for generating new arrays.

* [d3.merge](https://github.com/d3/d3-array#merge) - merge multiple arrays into one array.
* [d3.pairs](https://github.com/d3/d3-array#pairs) - create an array of adjacent pairs of elements.
* [d3.permute](https://github.com/d3/d3-array#permute) - reorder an array of elements according to an array of indexes.
* [d3.shuffle](https://github.com/d3/d3-array#shuffle) - randomize the order of an array.
* [d3.ticks](https://github.com/d3/d3-array#ticks) - generate representative values from a numeric interval.
* [d3.tickStep](https://github.com/d3/d3-array#tickStep) - generate representative values from a numeric interval.
* [d3.range](https://github.com/d3/d3-array#range) - generate a range of numeric values.
* [d3.transpose](https://github.com/d3/d3-array#transpose) - transpose an array of arrays.
* [d3.zip](https://github.com/d3/d3-array#zip) - transpose a variable number of arrays.

## [Axes (d3-axis)](https://github.com/d3/d3-axis)

Human-readable reference marks for scales.

* [d3.axisTop](https://github.com/d3/d3-axis#axisTop) - create a new top-oriented axis generator.
* [d3.axisRight](https://github.com/d3/d3-axis#axisTight) - create a new right-oriented axis generator.
* [d3.axisBottom](https://github.com/d3/d3-axis#axisTottom) - create a new bottom-oriented axis generator.
* [d3.axisLeft](https://github.com/d3/d3-axis#axisTeft) - create a new left-oriented axis generator.
* [*axis*](https://github.com/d3/d3-axis#_axis) - generate an axis for the given selection.
* [*axis*.scale](https://github.com/d3/d3-axis#axis_scale) - set the scale.
* [*axis*.ticks](https://github.com/d3/d3-axis#axis_ticks) - customize how ticks are generated and formatted.
* [*axis*.tickArguments](https://github.com/d3/d3-axis#axis_tickArguments) - customize how ticks are generated and formatted.
* [*axis*.tickValues](https://github.com/d3/d3-axis#axis_tickValues) - set the tick values explicitly.
* [*axis*.tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) - set the tick format explicitly.
* [*axis*.tickSize](https://github.com/d3/d3-axis#axis_tickSize) - set the size of the ticks.
* [*axis*.tickSizeInner](https://github.com/d3/d3-axis#axis_tickSizeInner) - set the size of inner ticks.
* [*axis*.tickSizeOuter](https://github.com/d3/d3-axis#axis_tickSizeOuter) - set the size of outer (extent) ticks.
* [*axis*.tickPadding](https://github.com/d3/d3-axis#axis_tickPadding) - set the padding between ticks and labels.

## [Brushes (d3-brush)](https://github.com/d3/d3-brush)

Select a one- or two-dimensional region using the mouse or touch.

* [d3.brush](https://github.com/d3/d3-brush#brush) -
* [d3.brushX](https://github.com/d3/d3-brush#brushX) -
* [d3.brushY](https://github.com/d3/d3-brush#brushY) -
* [*brush*](https://github.com/d3/d3-brush#_brush) -
* [*brush*.move](https://github.com/d3/d3-brush#brush_move) -
* [*brush*.extent](https://github.com/d3/d3-brush#brush_extent) -
* [*brush*.filter](https://github.com/d3/d3-brush#brush_filter) -
* [*brush*.handleSize](https://github.com/d3/d3-brush#brush_handleSize) -
* [*brush*.on](https://github.com/d3/d3-brush#brush_on) -
* [d3.brushSelection](https://github.com/d3/d3-brush#brushSelection) -

## [Collections (d3-collection)](https://github.com/d3/d3-collection)

Handy data structures for elements keyed by string.

#### [Objects](https://github.com/d3/d3-collection#objects)

Methods for converting associative arrays (objects) to arrays.

* [d3.keys](https://github.com/d3/d3-collection#keys) - list the keys of an associative array.
* [d3.values](https://github.com/d3/d3-collection#values) - list the values of an associated array.
* [d3.entries](https://github.com/d3/d3-collection#entries) - list the key-value entries of an associative array.

#### [Maps](https://github.com/d3/d3-collection#maps)

Like ES6 Map, but with string keys and a few other differences.

* [d3.map](https://github.com/d3/d3-collection#map) - create a new, empty map.
* [*map*.has](https://github.com/d3/d3-collection#map_has) - returns true if the map contains the given key.
* [*map*.get](https://github.com/d3/d3-collection#map_get) - get the value for the given key.
* [*map*.set](https://github.com/d3/d3-collection#map_set) - set the value for the given key.
* [*map*.remove](https://github.com/d3/d3-collection#map_remove) - remove the entry for given key.
* [*map*.clear](https://github.com/d3/d3-collection#map_clear) - remove all entries.
* [*map*.keys](https://github.com/d3/d3-collection#map_keys) - get the array of keys.
* [*map*.values](https://github.com/d3/d3-collection#map_values) - get the array of values.
* [*map*.entries](https://github.com/d3/d3-collection#map_entries) - get the array of entries (key-values objects).
* [*map*.each](https://github.com/d3/d3-collection#map_each) - call a function for each entry.
* [*map*.empty](https://github.com/d3/d3-collection#map_empty) - returns false if the map has at least one entry.
* [*map*.size](https://github.com/d3/d3-collection#map_size) - compute the number of entries.

#### [Sets](https://github.com/d3/d3-collection#sets)

Like ES6 Set, but with string keys and a few other differences.

* [d3.set](https://github.com/d3/d3-collection#set) - create a new, empty set.
* [*set*.has](https://github.com/d3/d3-collection#set_has) - returns true if the set contains the given value.
* [*set*.add](https://github.com/d3/d3-collection#set_add) - add the given value.
* [*set*.remove](https://github.com/d3/d3-collection#set_remove) - remove the given value.
* [*set*.clear](https://github.com/d3/d3-collection#set_clear) - remove all values.
* [*set*.values](https://github.com/d3/d3-collection#set_values) - get the array of values.
* [*set*.each](https://github.com/d3/d3-collection#set_each) - call a function for each value.
* [*set*.empty](https://github.com/d3/d3-collection#set_empty) - returns true if the set has at least one value.
* [*set*.size](https://github.com/d3/d3-collection#set_size) - compute the number of values.

#### [Nests](https://github.com/d3/d3-collection#nests)

Group data into arbitrary hierarchies.

* [d3.nest](https://github.com/d3/d3-collection#nest) - create a new nest generator.
* [*nest*.key](https://github.com/d3/d3-collection#nest_key) - add a level to the nest hierarchy.
* [*nest*.sortKeys](https://github.com/d3/d3-collection#nest_sortKeys) - sort the current nest level by key.
* [*nest*.sortValues](https://github.com/d3/d3-collection#nest_sortValues) - sort the leaf nest level by value.
* [*nest*.rollup](https://github.com/d3/d3-collection#nest_rollup) - specify a rollup function for leaf values.
* [*nest*.map](https://github.com/d3/d3-collection#nest_map) - generate the nest, returning a map.
* [*nest*.object](https://github.com/d3/d3-collection#nest_object) - generate the nest, returning an associative array.
* [*nest*.entries](https://github.com/d3/d3-collection#nest_entries) - generate the nest, returning an array of key-values tuples.

## [Colors (d3-color)](https://github.com/d3/d3-color)

Color manipulation and color space conversion.

* [d3.color](https://github.com/d3/d3-color#color) - parse the given CSS color specifier.
* [*color*.rgb](https://github.com/d3/d3-color#color_rgb) - compute the RGB equivalent of this color.
* [*color*.brighter](https://github.com/d3/d3-color#color_brighter) - create a brighter copy of this color.
* [*color*.darker](https://github.com/d3/d3-color#color_darker) - create a darker copy of this color.
* [*color*.displayable](https://github.com/d3/d3-color#color_displayable) - returns true if the color is displayable on standard hardware.
* [*color*.toString](https://github.com/d3/d3-color#color_toString) - format the color as an RGB hexadecimal string.
* [d3.rgb](https://github.com/d3/d3-color#rgb) - create a new RGB color.
* [d3.hsl](https://github.com/d3/d3-color#hsl) - create a new HSL color.
* [d3.lab](https://github.com/d3/d3-color#lab) - create a new Lab color.
* [d3.hcl](https://github.com/d3/d3-color#hcl) - create a new HCL color.
* [d3.cubehelix](https://github.com/d3/d3-color#cubehelix) - create a new Cubehelix color.

## [Delimiter-Separated Values (d3-dsv)](https://github.com/d3/d3-dsv)

Parse and format delimiter-separated values, most commonly CSV and TSV.

* [d3.dsvFormat](https://github.com/d3/d3-dsv#dsvFormat) - create a new parser and formatter for the given delimiter.
* [*dsv*.parse](https://github.com/d3/d3-dsv#dsv_parse) - parse the given string, returning an array of objects.
* [*dsv*.parseRows](https://github.com/d3/d3-dsv#dsv_parseRows) - parse the given string, returning an array of rows.
* [*dsv*.format](https://github.com/d3/d3-dsv#dsv_format) - format the given array of objects.
* [*dsv*.formatRows](https://github.com/d3/d3-dsv#dsv_formatRows) - format the given array of rows.
* [d3.csvParse](https://github.com/d3/d3-dsv#csvParse) - parse the given CSV string, returning an array of objects.
* [d3.csvParseRows](https://github.com/d3/d3-dsv#csvParseRows) - parse the given CSV string, returning an array of rows.
* [d3.csvFormat](https://github.com/d3/d3-dsv#csvFormat) - format the given array of objects as CSV.
* [d3.csvFormatRows](https://github.com/d3/d3-dsv#csvFormatRows) - format the given array of rows as CSV.
* [d3.tsvParse](https://github.com/d3/d3-dsv#tsvParse) - parse the given TSV string, returning an array of objects.
* [d3.tsvParseRows](https://github.com/d3/d3-dsv#tsvParseRows) - parse the given TSV string, returning an array of rows.
* [d3.tsvFormat](https://github.com/d3/d3-dsv#tsvFormat) - format the given array of objects as TSV.
* [d3.tsvFormatRows](https://github.com/d3/d3-dsv#tsvFormatRows) - format the given array of rows as TSV.

## [Dispatches (d3-dispatch)](https://github.com/d3/d3-dispatch)

Separate concerns using named callbacks.

* [d3.dispatch](https://github.com/d3/d3-dispatch#dispatch) - create a custom event dispatcher.
* [*dispatch*.on](https://github.com/d3/d3-dispatch#dispatch_on) - register or unregister an event listener.
* [*dispatch*.copy](https://github.com/d3/d3-dispatch#dispatch_copy) - create a copy of a dispatcher.
* [*dispatch*.*call*](https://github.com/d3/d3-dispatch#dispatch_call) - dispatch an event to registered listeners.
* [*dispatch*.*apply*](https://github.com/d3/d3-dispatch#dispatch_apply) - dispatch an event to registered listeners.

## [Dragging (d3-drag)](https://github.com/d3/d3-drag)

Drag and drop SVG, HTML or Canvas using mouse or touch input.

* [d3.drag](https://github.com/d3/d3-drag#drag) - create a drag behavior.
* [*drag*](https://github.com/d3/d3-drag#_drag) - apply the drag behavior to a selection.
* [*drag*.container](https://github.com/d3/d3-drag#drag_container) - set the coordinate system.
* [*drag*.filter](https://github.com/d3/d3-drag#drag_filter) - ignore some initiating input events.
* [*drag*.subject](https://github.com/d3/d3-drag#drag_subject) - set the thing being dragged.
* [*drag*.on](https://github.com/d3/d3-drag#drag_on) - listen for drag events.
* [*event*.on](https://github.com/d3/d3-drag#event_on) - listen for drag events on the current gesture.
* [d3.dragDisable](https://github.com/d3/d3-drag#dragDisable) -
* [d3.dragEnable](https://github.com/d3/d3-drag#dragEnable) -

## [Easings (d3-ease)](https://github.com/d3/d3-ease)

Easing functions for smooth animation.

* [*ease*](https://github.com/d3/d3-ease#_ease) - ease the given normalized time.
* [d3.easeLinear](https://github.com/d3/d3-ease#easeLinear) - linear easing; the identity function.
* [d3.easePolyIn](https://github.com/d3/d3-ease#easePolyIn) - polynomial easing; raises time to the given power.
* [d3.easePolyOut](https://github.com/d3/d3-ease#easePolyOut) - reverse polynomial easing.
* [d3.easePolyInOut](https://github.com/d3/d3-ease#easePolyInOut) - symmetric polynomial easing.
* [*poly*.exponent](https://github.com/d3/d3-ease#poly_exponent) - specify the polynomial exponent.
* [d3.easeQuad](https://github.com/d3/d3-ease#easeQuad) - an alias for easeQuadInOut.
* [d3.easeQuadIn](https://github.com/d3/d3-ease#easeQuadIn) - quadratic easing; squares time.
* [d3.easeQuadOut](https://github.com/d3/d3-ease#easeQuadOut) - reverse quadratic easing.
* [d3.easeQuadInOut](https://github.com/d3/d3-ease#easeQuadInOut) - symmetric quadratic easing.
* [d3.easeCubic](https://github.com/d3/d3-ease#easeCubic) - an alias for easeCubicInOut.
* [d3.easeCubicIn](https://github.com/d3/d3-ease#easeCubicIn) - cubic easing; cubes time.
* [d3.easeCubicOut](https://github.com/d3/d3-ease#easeCubicOut) - reverse cubic easing.
* [d3.easeCubicInOut](https://github.com/d3/d3-ease#easeCubicInOut) - symmetric cubic easing.
* [d3.easeSin](https://github.com/d3/d3-ease#easeSin) - an alias for easeSinInOut.
* [d3.easeSinIn](https://github.com/d3/d3-ease#easeSinIn) - sinusoidal easing.
* [d3.easeSinOut](https://github.com/d3/d3-ease#easeSinOut) - reverse sinusoidal easing.
* [d3.easeSinInOut](https://github.com/d3/d3-ease#easeSinInOut) - symmetric sinusoidal easing.
* [d3.easeExp](https://github.com/d3/d3-ease#easeExp) - an alias for easeExpInOut.
* [d3.easeExpIn](https://github.com/d3/d3-ease#easeExpIn) - exponential easing.
* [d3.easeExpOut](https://github.com/d3/d3-ease#easeExpOut) - reverse exponential easing.
* [d3.easeExpInOut](https://github.com/d3/d3-ease#easeExpInOut) - symmetric exponential easing.
* [d3.easeCircle](https://github.com/d3/d3-ease#easeCircle) - an alias for easeCircleInOut.
* [d3.easeCircleIn](https://github.com/d3/d3-ease#easeCircleIn) - circular easing.
* [d3.easeCircleOut](https://github.com/d3/d3-ease#easeCircleOut) - reverse circular easing.
* [d3.easeCircleInOut](https://github.com/d3/d3-ease#easeCircleInOut) - symmetric circular easing.
* [d3.easeElastic](https://github.com/d3/d3-ease#easeElastic) - an alias for easeElasticOut.
* [d3.easeElasticIn](https://github.com/d3/d3-ease#easeElasticIn) - elastic easing, like a rubber band.
* [d3.easeElasticOut](https://github.com/d3/d3-ease#easeElasticOut) - reverse elastic easing.
* [d3.easeElasticInOut](https://github.com/d3/d3-ease#easeElasticInOut) - symmetric elastic easing.
* [*elastic*.amplitude](https://github.com/d3/d3-ease#elastic_amplitude) - specify the elastic amplitude.
* [*elastic*.period](https://github.com/d3/d3-ease#elastic_period) - specify the elastic period.
* [d3.easeBack](https://github.com/d3/d3-ease#easeBack) - an alias for easeBackInOut.
* [d3.easeBackIn](https://github.com/d3/d3-ease#easeBackIn) - anticipatory easing, like a dancer bending his knees before jumping.
* [d3.easeBackOut](https://github.com/d3/d3-ease#easeBackOut) - reverse anticipatory easing.
* [d3.easeBackInOut](https://github.com/d3/d3-ease#easeBackInOut) - symmetric anticipatory easing.
* [*back*.overshoot](https://github.com/d3/d3-ease#back_overshoot) - specify the amount of overshoot.
* [d3.easeBounce](https://github.com/d3/d3-ease#easeBounce) - an alias for easeBounceOut.
* [d3.easeBounceIn](https://github.com/d3/d3-ease#easeBounceIn) - bounce easing, like a rubber ball.
* [d3.easeBounceOut](https://github.com/d3/d3-ease#easeBounceOut) - reverse bounce easing.
* [d3.easeBounceInOut](https://github.com/d3/d3-ease#easeBounceInOut) - symmetric bounce easing.

## [Forces (d3-force)](https://github.com/d3/d3-force)

Force-directed graph layout using velocity Verlet integration.

* [d3.forceSimulation](https://github.com/d3/d3-force#forceSimulation) - create a new force simulation.
* [*simulation*.restart](https://github.com/d3/d3-force#simulation_restart) - reheat and restart the simulation’s timer.
* [*simulation*.stop](https://github.com/d3/d3-force#simulation_stop) - stop the simulation’s timer.
* [*simulation*.tick](https://github.com/d3/d3-force#simulation_tick) - advance the simulation one step.
* [*simulation*.nodes](https://github.com/d3/d3-force#simulation_nodes) - set the simulation’s nodes.
* [*simulation*.alpha](https://github.com/d3/d3-force#simulation_alpha) - set the current alpha.
* [*simulation*.alphaMin](https://github.com/d3/d3-force#simulation_alphaMin) - set the minimum alpha threshold.
* [*simulation*.alphaDecay](https://github.com/d3/d3-force#simulation_alphaDecay) - set the alpha exponential decay rate.
* [*simulation*.alphaTarget](https://github.com/d3/d3-force#simulation_alphaTarget) - set the target alpha.
* [*simulation*.drag](https://github.com/d3/d3-force#simulation_drag) - set the drag coefficient.
* [*simulation*.force](https://github.com/d3/d3-force#simulation_force) - add or remove a force.
* [*simulation*.fix](https://github.com/d3/d3-force#simulation_fix) - fix a node in a given position.
* [*simulation*.unfix](https://github.com/d3/d3-force#simulation_unfix) - release a fixed node.
* [*simulation*.unfixAll](https://github.com/d3/d3-force#simulation_unfixAll) - release all fixed nodes.
* [*simulation*.find](https://github.com/d3/d3-force#simulation_find) - find the closest node to the given position.
* [*simulation*.on](https://github.com/d3/d3-force#simulation_on) - add or remove an event listener.
* [*force*](https://github.com/d3/d3-force#_force) - apply the force.
* [*force*.initialize](https://github.com/d3/d3-force#force_initialize) - initialize the force with the given nodes.
* [d3.forceCenter](https://github.com/d3/d3-force#forceCenter) - create a centering force.
* [*center*.x](https://github.com/d3/d3-force#center_x) - set the center *x*-coordinate.
* [*center*.y](https://github.com/d3/d3-force#center_y) - set the center *y*-coordinate.
* [d3.forceCollide](https://github.com/d3/d3-force#forceCollide) - create a circle collision force.
* [*collide*.radius](https://github.com/d3/d3-force#collide_radius) - set the circle radius.
* [*collide*.strength](https://github.com/d3/d3-force#collide_strength) - set the collision resolution strength.
* [*collide*.iterations](https://github.com/d3/d3-force#collide_iterations) - set the number of iterations.
* [d3.forceLink](https://github.com/d3/d3-force#forceLink) - create a link force.
* [*link*.links](https://github.com/d3/d3-force#link_links) - set the array of links.
* [*link*.id](https://github.com/d3/d3-force#link_id) - link nodes by numeric index or string identifier.
* [*link*.distance](https://github.com/d3/d3-force#link_distance) - set the link distance.
* [*link*.strength](https://github.com/d3/d3-force#link_strength) - set the link strength.
* [*link*.iterations](https://github.com/d3/d3-force#link_iterations) - set the number of iterations.
* [d3.forceManyBody](https://github.com/d3/d3-force#forceManyBody) - create a many-body force.
* [*manyBody*.strength](https://github.com/d3/d3-force#manyBody_strength) - set the force strength.
* [*manyBody*.theta](https://github.com/d3/d3-force#manyBody_theta) - set the Barnes–Hut approximation accuracy.
* [*manyBody*.distanceMin](https://github.com/d3/d3-force#manyBody_distanceMin) - limit the force when nodes are close.
* [*manyBody*.distanceMax](https://github.com/d3/d3-force#manyBody_distanceMax) - limit the force when nodes are far.
* [d3.forceX](https://github.com/d3/d3-force#forceX) - create an *x*-positioning force.
* [*x*.strength](https://github.com/d3/d3-force#x_strength) - set the force strength.
* [*x*.x](https://github.com/d3/d3-force#x_x) - set the target *x*-coordinate.
* [d3.forceY](https://github.com/d3/d3-force#forceY) - create an *y*-positioning force.
* [*y*.strength](https://github.com/d3/d3-force#y_strength) - set the force strength.
* [*y*.y](https://github.com/d3/d3-force#y_y) - set the target *y*-coordinate.

## [Hierarchies (d3-hierarchy)](https://github.com/d3/d3-hierarchy)

Layout algorithms for visualizing hierarchical data.

* [d3.hierarchy](#hierarchy) - constructs a root node from hierarchical data.
* [*node*.ancestors](#node_ancestors) - generate an array of ancestors.
* [*node*.descendants](#node_descendants) - generate an array of descendants.
* [*node*.leaves](#node_leaves) - generate an array of leaves.
* [*node*.links](#node_links) - generate an array of links.
* [*node*.path](#node_path) - generate the shortest path to another node.
* [*node*.sum](#node_sum) - evaluate and aggregate quantitative values.
* [*node*.sort](#node_sort) - sort all descendant siblings.
* [*node*.each](#node_each) - breadth-first traversal.
* [*node*.eachAfter](#node_eachAfter) - post-order traversal.
* [*node*.eachBefore](#node_eachBefore) - pre-order traversal.
* [*node*.copy](#node_copy) - copy a hierarchy.
* [d3.stratify](#stratify) - create a new stratify operator.
* [*stratify*](#_stratify) - construct a root node from tabular data.
* [*stratify*.id](#stratify_id) - set the node id accessor.
* [*stratify*.parentId](#stratify_parentId) - set the parent node id accessor.
* [d3.cluster](#cluster) - create a new cluster (dendrogram) layout.
* [*cluster*](#_cluster) - layout the specified hierarchy in a dendrogram.
* [*cluster*.size](#cluster_size) - set the layout size.
* [*cluster*.nodeSize](#cluster_nodeSize) - set the node size.
* [*cluster*.separation](#cluster_separation) - set the separation between leaves.
* [d3.tree](#tree) - create a new tidy tree layout.
* [*tree*](#_tree) - layout the specified hierarchy in a tidy tree.
* [*tree*.size](#tree_size) - set the layout size.
* [*tree*.nodeSize](#tree_nodeSize) - set the node size.
* [*tree*.separation](#tree_separation) - set the separation between nodes.
* [d3.treemap](#treemap) - create a new treemap layout.
* [*treemap*](#_treemap) - layout the specified hierarchy as a treemap.
* [*treemap*.tile](#treemap_tile) - set the tiling method.
* [*treemap*.size](#treemap_size) - set the layout size.
* [*treemap*.round](#treemap_round) - set whether the output coordinates are rounded.
* [*treemap*.padding](#treemap_padding) - set the padding.
* [*treemap*.paddingInner](#treemap_paddingInner) - set the padding between siblings.
* [*treemap*.paddingOuter](#treemap_paddingOuter) - set the padding between parent and children.
* [*treemap*.paddingTop](#treemap_paddingTop) - set the padding between the parent’s top edge and children.
* [*treemap*.paddingRight](#treemap_paddingRight) - set the padding between the parent’s right edge and children.
* [*treemap*.paddingBottom](#treemap_paddingBottom) - set the padding between the parent’s bottom edge and children.
* [*treemap*.paddingLeft](#treemap_paddingLeft) - set the padding between the parent’s left edge and children.
* [d3.treemapBinary](#treemapBinary) - tile using a balanced binary tree.
* [d3.treemapDice](#treemapDice) - tile into a horizontal row.
* [d3.treemapSlice](#treemapSlice) - tile into a vertical column.
* [d3.treemapSliceDice](#treemapSliceDice) - alternate between slicing and dicing.
* [d3.treemapSquarify](#treemapSquarify) - tile using squarified rows per Bruls *et. al.*
* [d3.treemapResquarify](#treemapResquarify) -
* [*squarify*.ratio](#squarify_ratio) - set the desired rectangle aspect ratio.
* [d3.partition](#partition) - create a new partition (icicle or sunburst) layout.
* [*partition*](#_partition) - layout the specified hierarchy as a partition diagram.
* [*partition*.size](#partition_size) - set the layout size.
* [*partition*.round](#partition_round) - set whether the output coordinates are rounded.
* [*partition*.padding](#partition_padding) - set the padding.
* [d3.pack](#pack) - create a new circle-packing layout.
* [*pack*](#_pack) - layout the specified hierarchy using circle-packing.
* [*pack*.radius](#pack_radius) - set the radius accessor.
* [*pack*.size](#pack_size) - set the layout size.
* [*pack*.padding](#pack_padding) - set the padding.
* [d3.packSiblings](#packSiblings) - pack the specified array of circles.
* [d3.packEnclose](#packEnclose) - enclose the specified array of circles.

## [Interpolators (d3-interpolate)](https://github.com/d3/d3-interpolate)

Interpolate numbers, colors, strings, arrays, objects, whatever!

* [d3.interpolate](https://github.com/d3/d3-interpolate#interpolate) - interpolate arbitrary values.
* [d3.interpolateArray](https://github.com/d3/d3-interpolate#interpolateArray) - interpolate arrays of arbitrary values.
* [d3.interpolateNumber](https://github.com/d3/d3-interpolate#interpolateNumber) - interpolate numbers.
* [d3.interpolateObject](https://github.com/d3/d3-interpolate#interpolateObject) - interpolate arbitrary objects.
* [d3.interpolateRound](https://github.com/d3/d3-interpolate#interpolateRound) - interpolate integers.
* [d3.interpolateString](https://github.com/d3/d3-interpolate#interpolateString) - interpolate strings with embedded numbers.
* [d3.interpolateTransformCss](https://github.com/d3/d3-interpolate#interpolateTransformCss) - interpolate 2D CSS transforms.
* [d3.interpolateTransformSvg](https://github.com/d3/d3-interpolate#interpolateTransformSvg) - interpolate 2D SVG transforms.
* [d3.interpolateZoom](https://github.com/d3/d3-interpolate#interpolateZoom) - zoom and pan between two views.
* [d3.interpolateRgb](https://github.com/d3/d3-interpolate#interpolateRgb) - interpolate RGB colors.
* [d3.interpolateRgbBasis](https://github.com/d3/d3-interpolate#interpolateRgbBasis) -
* [d3.interpolateRgbBasisClosed](https://github.com/d3/d3-interpolate#interpolateRgbBasisClosed) -
* [d3.interpolateHsl](https://github.com/d3/d3-interpolate#interpolateHsl) - interpolate HSL colors.
* [d3.interpolateHslLong](https://github.com/d3/d3-interpolate#interpolateHslLong) - interpolate HSL colors, the long way.
* [d3.interpolateLab](https://github.com/d3/d3-interpolate#interpolateLab) - interpolate Lab colors.
* [d3.interpolateHcl](https://github.com/d3/d3-interpolate#interpolateHcl) - interpolate HCL colors.
* [d3.interpolateHclLong](https://github.com/d3/d3-interpolate#interpolateHclLong) - interpolate HCL colors, the long way.
* [d3.interpolateCubehelix](https://github.com/d3/d3-interpolate#interpolateCubehelix) - interpolate Cubehelix colors.
* [d3.interpolateCubehelixLong](https://github.com/d3/d3-interpolate#interpolateCubehelixLong) - interpolate Cubehelix colors, the long way.
* [*interpolate*.gamma](https://github.com/d3/d3-interpolate#interpolate_gamma) - apply gamma correction during interpolation.
* [d3.interpolateBasis](https://github.com/d3/d3-interpolate#interpolateBasis) -
* [d3.interpolateBasisClosed](https://github.com/d3/d3-interpolate#interpolateBasisClosed) -
* [d3.quantize](https://github.com/d3/d3-interpolate#quantize) -

## [Number Formats (d3-format)](https://github.com/d3/d3-format)

Format numbers for human consumption.

* [d3.format](https://github.com/d3/d3-format#format) - alias for enUs.format.
* [d3.formatPrefix](https://github.com/d3/d3-format#formatPrefix) - alias for enUs.formatPrefix.
* [d3.formatSpecifier](https://github.com/d3/d3-format#formatSpecifier) - parse a number format specifier.
* [d3.formatLocale](https://github.com/d3/d3-format#formatLocale) - define a custom locale.
* [*locale*.format](https://github.com/d3/d3-format#locale_format) - create a number format.
* [*locale*.formatPrefix](https://github.com/d3/d3-format#locale_formatPrefix) - create a SI-prefix number format.
* [d3.precisionFixed](https://github.com/d3/d3-format#precisionFixed) - compute decimal precision for fixed-point notation.
* [d3.precisionPrefix](https://github.com/d3/d3-format#precisionPrefix) - compute decimal precision for SI-prefix notation.
* [d3.precisionRound](https://github.com/d3/d3-format#precisionRound) - compute significant digits for rounded notation.

## [Paths (d3-path)](https://github.com/d3/d3-path)

Serialize Canvas path commands to SVG.

* [d3.path](https://github.com/d3/d3-path#path) - create a new path serializer.
* [*path*.moveTo](https://github.com/d3/d3-path#path_moveTo) - move to the given point.
* [*path*.closePath](https://github.com/d3/d3-path#path_closePath) - close the current subpath.
* [*path*.lineTo](https://github.com/d3/d3-path#path_lineTo) - draw a straight line segment.
* [*path*.quadraticCurveTo](https://github.com/d3/d3-path#path_quadraticCurveTo) - draw a quadratic Bézier segment.
* [*path*.bezierCurveTo](https://github.com/d3/d3-path#path_bezierCurveTo) - draw a cubic Bézier segment.
* [*path*.arcTo](https://github.com/d3/d3-path#path_arcTo) - draw a circular arc segment.
* [*path*.arc](https://github.com/d3/d3-path#path_arc) - draw a circular arc segment.
* [*path*.rect](https://github.com/d3/d3-path#path_rect) - draw a rectangle.
* [*path*.toString](https://github.com/d3/d3-path#path_toString) - serialize to an SVG path data string.

## [Polygons (d3-polygon)](https://github.com/d3/d3-polygon)

Geometric operations for two-dimensional polygons.

* [d3.polygonArea](https://github.com/d3/d3-polygon#polygonArea) - compute the area of the given polygon.
* [d3.polygonCentroid](https://github.com/d3/d3-polygon#polygonCentroid) - compute the centroid of the given polygon.
* [d3.polygonHull](https://github.com/d3/d3-polygon#polygonHull) - compute the convex hull of the given points.
* [d3.polygonContains](https://github.com/d3/d3-polygon#polygonContains) - test whether a point is inside a polygon.
* [d3.polygonLength](https://github.com/d3/d3-polygon#polygonLength) - compute the length of the given polygon’s perimeter.

## [Quadtrees (d3-quadtree)](https://github.com/d3/d3-quadtree)

Two-dimensional recursive spatial subdivision.

* [d3.quadtree](https://github.com/d3/d3-quadtree#quadtree) - create a new, empty quadtree.
* [*quadtree*.x](https://github.com/d3/d3-quadtree#quadtree_x) - set the *x* accessor.
* [*quadtree*.y](https://github.com/d3/d3-quadtree#quadtree_y) - set the *y* accessor.
* [*quadtree*.add](https://github.com/d3/d3-quadtree#quadtree_add) - add a datum to a quadtree.
* [*quadtree*.addAll](https://github.com/d3/d3-quadtree#quadtree_addAll) -
* [*quadtree*.remove](https://github.com/d3/d3-quadtree#quadtree_remove) - remove a datum from a quadtree.
* [*quadtree*.removeAll](https://github.com/d3/d3-quadtree#quadtree_removeAll) -
* [*quadtree*.copy](https://github.com/d3/d3-quadtree#quadtree_copy) - create a copy of a quadtree.
* [*quadtree*.root](https://github.com/d3/d3-quadtree#quadtree_root) - get the quadtree’s root node.
* [*quadtree*.data](https://github.com/d3/d3-quadtree#quadtree_data) - retrieve all data from the quadtree.
* [*quadtree*.size](https://github.com/d3/d3-quadtree#quadtree_size) - count the number of data in the quadtree.
* [*quadtree*.find](https://github.com/d3/d3-quadtree#quadtree_find) - quickly find the closest datum in a quadtree.
* [*quadtree*.visit](https://github.com/d3/d3-quadtree#quadtree_visit) - selectively visit nodes in a quadtree.
* [*quadtree*.visitAfter](https://github.com/d3/d3-quadtree#quadtree_visitAfter) - visit all nodes in a quadtree.
* [*quadtree*.cover](https://github.com/d3/d3-quadtree#quadtree_cover) - extend the quadtree to cover a point.
* [*quadtree*.extent](https://github.com/d3/d3-quadtree#quadtree_extent) - extend the quadtree to cover an extent.

## [Queues (d3-queue)](https://github.com/d3/d3-queue)

Evaluate asynchronous tasks with configurable concurrency.

* [d3.queue](https://github.com/d3/d3-queue#queue) - manage the concurrent evaluation of asynchronous tasks.
* [*queue*.defer](https://github.com/d3/d3-queue#queue_defer) - register a task for evaluation.
* [*queue*.abort](https://github.com/d3/d3-queue#queue_abort) - abort any active tasks and cancel any pending ones.
* [*queue*.await](https://github.com/d3/d3-queue#queue_await) - register a callback for when tasks complete.
* [*queue*.awaitAll](https://github.com/d3/d3-queue#queue_awaitAll) - register a callback for when tasks complete.

## [Random Numbers (d3-random)](https://github.com/d3/d3-random)

Generate random numbers from various distributions.

* [d3.randomUniform](https://github.com/d3/d3-random#randomUniform) - from a uniform distribution.
* [d3.randomNormal](https://github.com/d3/d3-random#randomNormal) - from a normal distribution.
* [d3.randomLogNormal](https://github.com/d3/d3-random#randomLogNormal) - from a log-normal distribution.
* [d3.randomBates](https://github.com/d3/d3-random#randomBates) - from a Bates distribution.
* [d3.randomIrwinHall](https://github.com/d3/d3-random#randomIrwinHall) - from an Irwin–Hall distribution.
* [d3.randomExponential](https://github.com/d3/d3-random#randomExponential) - from an exponential distribution.

## [Requests (d3-request)](https://github.com/d3/d3-request)

A convenient alternative to asynchronous XMLHttpRequest.

* [d3.request](https://github.com/d3/d3-request#request) - make an asynchronous request.
* [*request*.header](https://github.com/d3/d3-request#request_header) - set a request header.
* [*request*.user](https://github.com/d3/d3-request#request_user) - set the user for authentication.
* [*request*.password](https://github.com/d3/d3-request#request_password) - set the password for authentication.
* [*request*.mimeType](https://github.com/d3/d3-request#request_mimeType) - set the MIME type.
* [*request*.timeout](https://github.com/d3/d3-request#request_timeout) - set the timeout in milliseconds.
* [*request*.responseType](https://github.com/d3/d3-request#request_responseType) - set the response type.
* [*request*.response](https://github.com/d3/d3-request#request_response) - set the response function.
* [*request*.get](https://github.com/d3/d3-request#request_get) - send a GET request.
* [*request*.post](https://github.com/d3/d3-request#request_post) - send a POST request.
* [*request*.send](https://github.com/d3/d3-request#request_send) - set the request.
* [*request*.abort](https://github.com/d3/d3-request#request_abort) - abort the request.
* [*request*.on](https://github.com/d3/d3-request#request_on) - listen for a request event.
* [d3.csv](https://github.com/d3/d3-request#csv) - get a comma-separated values (CSV) file.
* [d3.html](https://github.com/d3/d3-request#html) - get an HTML file.
* [d3.json](https://github.com/d3/d3-request#json) - get a JSON file.
* [d3.text](https://github.com/d3/d3-request#text) - get a plain text file.
* [d3.tsv](https://github.com/d3/d3-request#tsv) - get a tab-separated values (TSV) file.
* [d3.xml](https://github.com/d3/d3-request#xml) - get an XML file.

## [Scales (d3-scale)](https://github.com/d3/d3-scale)

Encodings that map abstract data to visual representation.

### [Continuous Scales](https://github.com/d3/d3-scale#continuous-scales)

Map a continuous, quantitative domain to a continuous range.

* [*continuous*](https://github.com/d3/d3-scale#_continuous) - compute the range value corresponding to a given domain value.
* [*continuous*.invert](https://github.com/d3/d3-scale#continuous_invert) - compute the domain value corresponding to a given range value.
* [*continuous*.domain](https://github.com/d3/d3-scale#continuous_domain) - set the input domain.
* [*continuous*.range](https://github.com/d3/d3-scale#continuous_range) - set the output range.
* [*continuous*.rangeRound](https://github.com/d3/d3-scale#continuous_rangeRound) - set the output range and enable rounding.
* [*continuous*.clamp](https://github.com/d3/d3-scale#continuous_clamp) - enable clamping to the domain or range.
* [*continuous*.interpolate](https://github.com/d3/d3-scale#continuous_interpolate) - set the output interpolator.
* [*continuous*.ticks](https://github.com/d3/d3-scale#continuous_ticks) - compute representative values from the domain.
* [*continuous*.tickFormat](https://github.com/d3/d3-scale#continuous_tickFormat) - format ticks for human consumption.
* [*continuous*.nice](https://github.com/d3/d3-scale#continuous_nice) - extend the domain to nice round numbers.
* [*continuous*.copy](https://github.com/d3/d3-scale#continuous_copy) - create a copy of this scale.
* [d3.scaleLinear](https://github.com/d3/d3-scale#scaleLinear) - create a quantitative linear scale.
* [d3.scalePow](https://github.com/d3/d3-scale#scalePow) - create a quantitative power scale.
* [*pow*](https://github.com/d3/d3-scale#_pow) - compute the range value corresponding to a given domain value.
* [*pow*.invert](https://github.com/d3/d3-scale#pow_invert) - compute the domain value corresponding to a given range value.
* [*pow*.exponent](https://github.com/d3/d3-scale#pow_exponent) - set the power exponent.
* [*pow*.domain](https://github.com/d3/d3-scale#pow_domain) - set the input domain.
* [*pow*.range](https://github.com/d3/d3-scale#pow_range) - set the output range.
* [*pow*.rangeRound](https://github.com/d3/d3-scale#pow_rangeRound) - set the output range and enable rounding.
* [*pow*.clamp](https://github.com/d3/d3-scale#pow_clamp) - enable clamping to the domain or range.
* [*pow*.interpolate](https://github.com/d3/d3-scale#pow_interpolate) - set the output interpolator.
* [*pow*.ticks](https://github.com/d3/d3-scale#pow_ticks) - compute representative values from the domain.
* [*pow*.tickFormat](https://github.com/d3/d3-scale#pow_tickFormat) - format ticks for human consumption.
* [*pow*.nice](https://github.com/d3/d3-scale#pow_nice) - extend the domain to nice round numbers.
* [*pow*.copy](https://github.com/d3/d3-scale#pow_copy) - create a copy of this scale.
* [d3.scaleSqrt](https://github.com/d3/d3-scale#scaleSqrt) - create a quantitative power scale with exponent 0.5.
* [d3.scaleLog](https://github.com/d3/d3-scale#scaleLog) - create a quantitative logarithmic scale.
* [*log*](https://github.com/d3/d3-scale#_log) - compute the range value corresponding to a given domain value.
* [*log*.invert](https://github.com/d3/d3-scale#log_invert) - compute the domain value corresponding to a given range value.
* [*log*.base](https://github.com/d3/d3-scale#log_base) - set the logarithm base.
* [*log*.domain](https://github.com/d3/d3-scale#log_domain) - set the input domain.
* [*log*.range](https://github.com/d3/d3-scale#log_range) - set the output range.
* [*log*.rangeRound](https://github.com/d3/d3-scale#log_rangeRound) - set the output range and enable rounding.
* [*log*.clamp](https://github.com/d3/d3-scale#log_clamp) - enable clamping to the domain or range.
* [*log*.interpolate](https://github.com/d3/d3-scale#log_interpolate) - set the output interpolator.
* [*log*.ticks](https://github.com/d3/d3-scale#log_ticks) - compute representative values from the domain.
* [*log*.tickFormat](https://github.com/d3/d3-scale#log_tickFormat) - format ticks for human consumption.
* [*log*.nice](https://github.com/d3/d3-scale#log_nice) - extend the domain to nice round numbers.
* [*log*.copy](https://github.com/d3/d3-scale#log_copy) - create a copy of this scale.
* [d3.scaleIdentity](https://github.com/d3/d3-scale#identity) - create a quantitative identity scale.
* [d3.scaleTime](https://github.com/d3/d3-scale#scaleTime) - create a linear scale for time.
* [*time*](https://github.com/d3/d3-scale#_time) - compute the range value corresponding to a given domain value.
* [*time*.invert](https://github.com/d3/d3-scale#time_invert) - compute the domain value corresponding to a given range value.
* [*time*.domain](https://github.com/d3/d3-scale#time_domain) - set the input domain.
* [*time*.range](https://github.com/d3/d3-scale#time_range) - set the output range.
* [*time*.rangeRound](https://github.com/d3/d3-scale#time_rangeRound) - set the output range and enable rounding.
* [*time*.clamp](https://github.com/d3/d3-scale#time_clamp) - enable clamping to the domain or range.
* [*time*.interpolate](https://github.com/d3/d3-scale#time_interpolate) - set the output interpolator.
* [*time*.ticks](https://github.com/d3/d3-scale#time_ticks) - compute representative values from the domain.
* [*time*.tickFormat](https://github.com/d3/d3-scale#time_tickFormat) - format ticks for human consumption.
* [*time*.nice](https://github.com/d3/d3-scale#time_nice) - extend the domain to nice round times.
* [*time*.copy](https://github.com/d3/d3-scale#time_copy) - create a copy of this scale.
* [d3.scaleUtc](https://github.com/d3/d3-scale#scaleUtc) - create a linear scale for UTC.

### [Sequential Scales](https://github.com/d3/d3-scale#sequential-scales)

Map a continuous, quantitative domain to a continuous, fixed interpolator.

* [d3.scaleSequential](https://github.com/d3/d3-scale#scaleSequential) - create a sequential scale.
* [d3.interpolateViridis](https://github.com/d3/d3-scale#interpolateViridis) - a dark-to-light color scheme.
* [d3.interpolateInferno](https://github.com/d3/d3-scale#interpolateInferno) - a dark-to-light color scheme.
* [d3.interpolateMagma](https://github.com/d3/d3-scale#interpolateMagma) - a dark-to-light color scheme.
* [d3.interpolatePlasma](https://github.com/d3/d3-scale#interpolatePlasma) - a dark-to-light color scheme.
* [d3.interpolateWarm](https://github.com/d3/d3-scale#interpolateWarm) - a rotating-hue color scheme.
* [d3.interpolateCool](https://github.com/d3/d3-scale#interpolateCool) - a rotating-hue color scheme.
* [d3.interpolateRainbow](https://github.com/d3/d3-scale#interpolateRainbow) - a cyclical rotating-hue color scheme.
* [d3.interpolateCubehelixDefault](https://github.com/d3/d3-scale#interpolateCubehelixDefault) - a dark-to-light, rotating-hue color scheme.

### [Quantize Scales](https://github.com/d3/d3-scale#quantize-scales)

Map a continuous, quantitative domain to a discrete range.

* [d3.scaleQuantize](https://github.com/d3/d3-scale#scaleQuantize) - create a uniform quantizing linear scale.
* [*quantize*](https://github.com/d3/d3-scale#_quantize) - compute the range value corresponding to a given domain value.
* [*quantize*.invertExtent](https://github.com/d3/d3-scale#quantize_invertExtent) - compute the domain values corresponding to a given range value.
* [*quantize*.domain](https://github.com/d3/d3-scale#quantize_domain) - set the input domain.
* [*quantize*.range](https://github.com/d3/d3-scale#quantize_range) - set the output range.
* [*quantize*.nice](https://github.com/d3/d3-scale#quantize_nice) - extend the domain to nice round numbers.
* [*quantize*.ticks](https://github.com/d3/d3-scale#quantize_ticks) - compute representative values from the domain.
* [*quantize*.tickFormat](https://github.com/d3/d3-scale#quantize_tickFormat) - format ticks for human consumption.
* [*quantize*.copy](https://github.com/d3/d3-scale#quantize_copy) - create a copy of this scale.
* [d3.scaleQuantile](https://github.com/d3/d3-scale#scaleQuantile) - create a quantile quantizing linear scale.
* [*quantile*](https://github.com/d3/d3-scale#_quantile) - compute the range value corresponding to a given domain value.
* [*quantile*.invertExtent](https://github.com/d3/d3-scale#quantile_invertExtent) - compute the domain values corresponding to a given range value.
* [*quantile*.domain](https://github.com/d3/d3-scale#quantile_domain) - set the input domain.
* [*quantile*.range](https://github.com/d3/d3-scale#quantile_range) - set the output range.
* [*quantile*.quantiles](https://github.com/d3/d3-scale#quantile_quantiles) - get the quantile thresholds.
* [*quantile*.copy](https://github.com/d3/d3-scale#quantile_copy) - create a copy of this scale.
* [d3.scaleThreshold](https://github.com/d3/d3-scale#scaleThreshold) - create an arbitrary quantizing linear scale.
* [*threshold*](https://github.com/d3/d3-scale#_threshold) - compute the range value corresponding to a given domain value.
* [*threshold*.invertExtent](https://github.com/d3/d3-scale#threshold_invertExtent) - compute the domain values corresponding to a given range value.
* [*threshold*.domain](https://github.com/d3/d3-scale#threshold_domain) - set the input domain.
* [*threshold*.range](https://github.com/d3/d3-scale#threshold_range) - set the output range.
* [*threshold*.copy](https://github.com/d3/d3-scale#threshold_copy) - create a copy of this scale.

### [Ordinal Scales](https://github.com/d3/d3-scale#ordinal-scales)

Map a discrete domain to a discrete range.

* [d3.scaleOrdinal](https://github.com/d3/d3-scale#scaleOrdinal) - create an ordinal scale.
* [*ordinal*](https://github.com/d3/d3-scale#_ordinal) - compute the range value corresponding to a given domain value.
* [*ordinal*.domain](https://github.com/d3/d3-scale#ordinal_domain) - set the input domain.
* [*ordinal*.range](https://github.com/d3/d3-scale#ordinal_range) - set the output range.
* [*ordinal*.unknown](https://github.com/d3/d3-scale#ordinal_unknown) - set the output value for unknown inputs.
* [*ordinal*.copy](https://github.com/d3/d3-scale#ordinal_copy) - create a copy of this scale.
* [d3.scaleImplicit](https://github.com/d3/d3-scale#scaleImplicit) - a special unknown value for implicit domains.
* [d3.scaleBand](https://github.com/d3/d3-scale#scaleBand) - create an ordinal band scale.
* [*band*](https://github.com/d3/d3-scale#_band) - compute the band start corresponding to a given domain value.
* [*band*.domain](https://github.com/d3/d3-scale#band_domain) - set the input domain.
* [*band*.range](https://github.com/d3/d3-scale#band_range) - set the output range.
* [*band*.rangeRound](https://github.com/d3/d3-scale#band_rangeRound) - set the output range and enable rounding.
* [*band*.round](https://github.com/d3/d3-scale#band_round) - enable rounding.
* [*band*.paddingInner](https://github.com/d3/d3-scale#band_paddingInner) - set padding between bands.
* [*band*.paddingOuter](https://github.com/d3/d3-scale#band_paddingOuter) - set padding outside the first and last bands.
* [*band*.padding](https://github.com/d3/d3-scale#band_padding) - set padding outside and between bands.
* [*band*.align](https://github.com/d3/d3-scale#band_align) - set band alignment, if there is extra space.
* [*band*.bandwidth](https://github.com/d3/d3-scale#band_bandwidth) - get the width of each band.
* [*band*.step](https://github.com/d3/d3-scale#band_step) - get the distance between the starts of adjacent bands.
* [*band*.copy](https://github.com/d3/d3-scale#band_copy) - create a copy of this scale.
* [d3.scalePoint](https://github.com/d3/d3-scale#scalePoint) - create an ordinal point scale.
* [*point*](https://github.com/d3/d3-scale#_point) - compute the point corresponding to a given domain value.
* [*point*.domain](https://github.com/d3/d3-scale#point_domain) - set the input domain.
* [*point*.range](https://github.com/d3/d3-scale#point_range) - set the output range.
* [*point*.rangeRound](https://github.com/d3/d3-scale#point_rangeRound) - set the output range and enable rounding.
* [*point*.round](https://github.com/d3/d3-scale#point_round) - enable rounding.
* [*point*.padding](https://github.com/d3/d3-scale#point_padding) - set padding outside the first and last point.
* [*point*.align](https://github.com/d3/d3-scale#point_align) - set point alignment, if there is extra space.
* [*point*.bandwidth](https://github.com/d3/d3-scale#point_bandwidth) - returns zero.
* [*point*.step](https://github.com/d3/d3-scale#point_step) - get the distance between the starts of adjacent points.
* [*point*.copy](https://github.com/d3/d3-scale#point_copy) - create a copy of this scale.
* [d3.schemeCategory10](https://github.com/d3/d3-scale#schemeCategory10) - a categorical scheme with 10 colors.
* [d3.schemeCategory20](https://github.com/d3/d3-scale#schemeCategory20) - a categorical scheme with 20 colors.
* [d3.schemeCategory20b](https://github.com/d3/d3-scale#schemeCategory20b) - a categorical scheme with 20 colors.
* [d3.schemeCategory20c](https://github.com/d3/d3-scale#schemeCategory20c) - a categorical scheme with 20 colors.

## [Selections (d3-selection)](https://github.com/d3/d3-selection)

Transform the DOM by selecting elements and joining to data.

### [Selecting Elements](https://github.com/d3/d3-selection#selecting-elements)

* [d3.selection](https://github.com/d3/d3-selection#selection) - select the root document element.
* [d3.select](https://github.com/d3/d3-selection#select) - select an element from the document.
* [d3.selectAll](https://github.com/d3/d3-selection#selectAll) - select multiple elements from the document.
* [*selection*.select](https://github.com/d3/d3-selection#selection_select) - select a descendant element for each selected element.
* [*selection*.selectAll](https://github.com/d3/d3-selection#selection_selectAll) - select multiple descendants for each selected element.
* [*selection*.filter](https://github.com/d3/d3-selection#selection_filter) - filter elements based on data.
* [*selection*.merge](https://github.com/d3/d3-selection#selection_merge) - merge this selection with another.
* [d3.matcher](https://github.com/d3/d3-selection#matcher) - test whether an element matches a selector.
* [d3.selector](https://github.com/d3/d3-selection#selector) - select an element.
* [d3.selectorAll](https://github.com/d3/d3-selection#selectorAll) - select elements.
* [d3.window](https://github.com/d3/d3-selection#window) - get a node’s owner window.

### [Modifying Elements](https://github.com/d3/d3-selection#modifying-elements)

* [*selection*.attr](https://github.com/d3/d3-selection#selection_attr) - get or set an attribute.
* [*selection*.classed](https://github.com/d3/d3-selection#selection_classed) - get, add or remove CSS classes.
* [*selection*.style](https://github.com/d3/d3-selection#selection_style) - get or set a style property.
* [*selection*.property](https://github.com/d3/d3-selection#selection_property) - get or set a (raw) property.
* [*selection*.text](https://github.com/d3/d3-selection#selection_text) - get or set the text content.
* [*selection*.html](https://github.com/d3/d3-selection#selection_html) - get or set the inner HTML.
* [*selection*.append](https://github.com/d3/d3-selection#selection_append) - create, append and select new elements.
* [*selection*.insert](https://github.com/d3/d3-selection#selection_insert) -
* [*selection*.remove](https://github.com/d3/d3-selection#selection_remove) - remove elements from the document.
* [*selection*.sort](https://github.com/d3/d3-selection#selection_sort) - sort elements in the document based on data.
* [*selection*.order](https://github.com/d3/d3-selection#selection_order) - reorders elements in the document to match the selection.
* [*selection*.raise](https://github.com/d3/d3-selection#selection_raise) - reorders each element as the last child of its parent.
* [*selection*.lower](https://github.com/d3/d3-selection#selection_lower) - reorders each element as the first child of its parent.
* [d3.creator](https://github.com/d3/d3-selection#creator) - create an element by name.

### [Joining Data](https://github.com/d3/d3-selection#joining-data)

* [*selection*.data](https://github.com/d3/d3-selection#selection_data) - join elements to data.
* [*selection*.enter](https://github.com/d3/d3-selection#selection_enter) - get the enter selection (data missing elements).
* [*selection*.exit](https://github.com/d3/d3-selection#selection_exit) - get the exit selection (elements missing data).
* [*selection*.datum](https://github.com/d3/d3-selection#selection_datum) - get or set element data (without joining).

### [Handling Events](https://github.com/d3/d3-selection#handling-events)

* [*selection*.on](https://github.com/d3/d3-selection#selection_on) - add or remove event listeners.
* [*selection*.dispatch](https://github.com/d3/d3-selection#selection_dispatch) - dispatch a custom event.
* [d3.event](https://github.com/d3/d3-selection#event) - the current user event, during interaction.
* [d3.customEvent](https://github.com/d3/d3-selection#customEvent) - temporarily define a custom event.
* [d3.mouse](https://github.com/d3/d3-selection#mouse) - get the mouse position relative to a given container.
* [d3.touch](https://github.com/d3/d3-selection#touch) - get a touch position relative to a given container.
* [d3.touches](https://github.com/d3/d3-selection#touches) - get the touch positions relative to a given container.

### [Control Flow](https://github.com/d3/d3-selection#control-flow)

* [*selection*.each](https://github.com/d3/d3-selection#selection_each) - call a function for each element.
* [*selection*.call](https://github.com/d3/d3-selection#selection_call) - call a function with this selection.
* [*selection*.empty](https://github.com/d3/d3-selection#selection_empty) - returns true if this selection is empty.
* [*selection*.nodes](https://github.com/d3/d3-selection#selection_nodes) - returns an array of all selected elements.
* [*selection*.node](https://github.com/d3/d3-selection#selection_node) - returns the first (non-null) element.
* [*selection*.size](https://github.com/d3/d3-selection#selection_size) - returns the count of elements.

### [Local Variables](https://github.com/d3/d3-selection#local-variables)

* [d3.local](https://github.com/d3/d3-selection#local) -
* [*local*.set](https://github.com/d3/d3-selection#local_set) -
* [*local*.get](https://github.com/d3/d3-selection#local_get) -
* [*local*.remove](https://github.com/d3/d3-selection#local_remove) -
* [*local*.toString](https://github.com/d3/d3-selection#local_toString) -

### [Namespaces](https://github.com/d3/d3-selection#namespaces)

* [d3.namespace](https://github.com/d3/d3-selection#namespace) - qualify a prefixed XML name, such as “xlink:href”.
* [d3.namespaces](https://github.com/d3/d3-selection#namespaces) - the built-in XML namespaces.

## [Shapes (d3-shape)](https://github.com/d3/d3-shape)

Graphical primitives for visualization.

### [Arcs](https://github.com/d3/d3-shape#arcs)

Circular or annular sectors, as in a pie or donut chart.

* [d3.arc](https://github.com/d3/d3-shape#arc) - create a new arc generator.
* [*arc*](https://github.com/d3/d3-shape#_arc) - generate an arc for the given datum.
* [*arc*.centroid](https://github.com/d3/d3-shape#arc_centroid) - compute an arc’s midpoint.
* [*arc*.innerRadius](https://github.com/d3/d3-shape#arc_innerRadius) - set the inner radius.
* [*arc*.outerRadius](https://github.com/d3/d3-shape#arc_outerRadius) - set the outer radius.
* [*arc*.cornerRadius](https://github.com/d3/d3-shape#arc_cornerRadius) - set the corner radius, for rounded corners.
* [*arc*.startAngle](https://github.com/d3/d3-shape#arc_startAngle) - set the start angle.
* [*arc*.endAngle](https://github.com/d3/d3-shape#arc_endAngle) - set the end angle.
* [*arc*.padAngle](https://github.com/d3/d3-shape#arc_padAngle) - set the angle between adjacent arcs, for padded arcs.
* [*arc*.padRadius](https://github.com/d3/d3-shape#arc_padRadius) - set the radius at which to linearize padding.
* [*arc*.context](https://github.com/d3/d3-shape#arc_context) - set the rendering context.

### [Pies](https://github.com/d3/d3-shape#pies)

Compute the necessary angles to represent a tabular dataset as a pie or donut chart.

* [d3.pie](https://github.com/d3/d3-shape#pie) - create a new pie generator.
* [*pie*](https://github.com/d3/d3-shape#_pie) - compute the arc angles for the given dataset.
* [*pie*.value](https://github.com/d3/d3-shape#pie_value) - set the value accessor.
* [*pie*.sort](https://github.com/d3/d3-shape#pie_sort) - set the sort order comparator.
* [*pie*.sortValues](https://github.com/d3/d3-shape#pie_sortValues) - set the sort order comparator.
* [*pie*.startAngle](https://github.com/d3/d3-shape#pie_startAngle) - set the overall start angle.
* [*pie*.endAngle](https://github.com/d3/d3-shape#pie_endAngle) - set the overall end angle.
* [*pie*.padAngle](https://github.com/d3/d3-shape#pie_padAngle) - set the pad angle between adjacent arcs.

### [Lines](https://github.com/d3/d3-shape#lines)

A spline or polyline, as in a line chart.

* [d3.line](https://github.com/d3/d3-shape#line) - create a new line generator.
* [*line*](https://github.com/d3/d3-shape#_line) - generate a line for the given dataset.
* [*line*.x](https://github.com/d3/d3-shape#line_x) - set the *x* accessor.
* [*line*.y](https://github.com/d3/d3-shape#line_y) - set the *y* accessor.
* [*line*.defined](https://github.com/d3/d3-shape#line_defined) - set the defined accessor.
* [*line*.curve](https://github.com/d3/d3-shape#line_curve) - set the curve interpolator.
* [*line*.context](https://github.com/d3/d3-shape#line_context) - set the rendering context.
* [d3.radialLine](https://github.com/d3/d3-shape#radialLine) - create a new radial line generator.
* [*radialLine*](https://github.com/d3/d3-shape#_radialLine) - generate a line for the given dataset.
* [*radialLine*.angle](https://github.com/d3/d3-shape#radialLine_angle) - set the angle accessor.
* [*radialLine*.radius](https://github.com/d3/d3-shape#radialLine_radius) - set the radius accessor.
* [*radialLine*.defined](https://github.com/d3/d3-shape#radialLine_defined) - set the defined accessor.
* [*radialLine*.curve](https://github.com/d3/d3-shape#radialLine_curve) - set the curve interpolator.
* [*radialLine*.context](https://github.com/d3/d3-shape#radialLine_context) - set the rendering context.

### [Areas](https://github.com/d3/d3-shape#areas)

An area, defined by a bounding topline and baseline, as in an area chart.

* [d3.area](https://github.com/d3/d3-shape#area) - create a new area generator.
* [*area*](https://github.com/d3/d3-shape#_area) - generate an area for the given dataset.
* [*area*.x](https://github.com/d3/d3-shape#area_x) - set the *x0* and *x1* accessors.
* [*area*.x0](https://github.com/d3/d3-shape#area_x0) - set the baseline *x* accessor.
* [*area*.x1](https://github.com/d3/d3-shape#area_x1) - set the topline *x* accessor.
* [*area*.y](https://github.com/d3/d3-shape#area_y) - set the *y0* and *y1* accessors.
* [*area*.y0](https://github.com/d3/d3-shape#area_y0) - set the baseline *y* accessor.
* [*area*.y1](https://github.com/d3/d3-shape#area_y1) - set the topline *y* accessor.
* [*area*.defined](https://github.com/d3/d3-shape#area_defined) - set the defined accessor.
* [*area*.curve](https://github.com/d3/d3-shape#area_curve) - set the curve interpolator.
* [*area*.context](https://github.com/d3/d3-shape#area_context) - set the rendering context.
* [d3.radialArea](https://github.com/d3/d3-shape#radialArea) - create a new radial area generator.
* [*radialArea*](https://github.com/d3/d3-shape#_radialArea) - generate an area for the given dataset.
* [*radialArea*.angle](https://github.com/d3/d3-shape#radialArea_angle) - set the start and end angle accessors.
* [*radialArea*.startAngle](https://github.com/d3/d3-shape#radialArea_startAngle) - set the start angle accessor.
* [*radialArea*.endAngle](https://github.com/d3/d3-shape#radialArea_endAngle) - set the end angle accessor.
* [*radialArea*.radius](https://github.com/d3/d3-shape#radialArea_radius) - set the inner and outer radius accessors.
* [*radialArea*.innerRadius](https://github.com/d3/d3-shape#radialArea_innerRadius) - set the inner radius accessor.
* [*radialArea*.outerRadius](https://github.com/d3/d3-shape#radialArea_outerRadius) - set the outer radius accessor.
* [*radialArea*.defined](https://github.com/d3/d3-shape#radialArea_defined) - set the defined accessor.
* [*radialArea*.curve](https://github.com/d3/d3-shape#radialArea_curve) - set the curve interpolator.
* [*radialArea*.context](https://github.com/d3/d3-shape#radialArea_context) - set the rendering context.

### [Curves](https://github.com/d3/d3-shape#curves)

Interpolate between points to produce a continuous shape.

* [d3.curveBasis](https://github.com/d3/d3-shape#curveBasis) - a cubic basis spline, repeating the end points.
* [d3.curveBasisClosed](https://github.com/d3/d3-shape#curveBasisClosed) - a closed cubic basis spline.
* [d3.curveBasisOpen](https://github.com/d3/d3-shape#curveBasisOpen) - a cubic basis spline.
* [d3.curveBundle](https://github.com/d3/d3-shape#curveBundle) - a straightened cubic basis spline.
* [d3.curveCardinal](https://github.com/d3/d3-shape#curveCardinal) - a cubic cardinal spline, with one-sided difference at each end.
* [d3.curveCardinalClosed](https://github.com/d3/d3-shape#curveCardinalClosed) - a closed cubic cardinal spline.
* [d3.curveCardinalOpen](https://github.com/d3/d3-shape#curveCardinalOpen) - a cubic cardinal spline.
* [d3.curveCatmullRom](https://github.com/d3/d3-shape#curveCatmullRom) - a cubic Catmull–Rom spline, with one-sided difference at each end.
* [d3.curveCatmullRomClosed](https://github.com/d3/d3-shape#curveCatmullRomClosed) - a closed cubic Catmull–Rom spline.
* [d3.curveCatmullRomOpen](https://github.com/d3/d3-shape#curveCatmullRomOpen) - a cubic Catmull–Rom spline.
* [d3.curveLinear](https://github.com/d3/d3-shape#curveLinear) - a polyline.
* [d3.curveLinearClosed](https://github.com/d3/d3-shape#curveLinearClosed) - a closed polyline.
* [d3.curveMonotoneX](https://github.com/d3/d3-shape#curveMonotoneX) - a cubic spline that, given monotonicity in *x*, preserves it in *y*.
* [d3.curveMonotoneY](https://github.com/d3/d3-shape#curveMonotoneY) - a cubic spline that, given monotonicity in *y*, preserves it in *x*.
* [d3.curveNatural](https://github.com/d3/d3-shape#curveNatural) - a natural cubic spline.
* [d3.curveStep](https://github.com/d3/d3-shape#curveStep) - a piecewise constant function.
* [d3.curveStepAfter](https://github.com/d3/d3-shape#curveStepAfter) - a piecewise constant function.
* [d3.curveStepBefore](https://github.com/d3/d3-shape#curveStepBefore) - a piecewise constant function.
* [*curve*.areaStart](https://github.com/d3/d3-shape#curve_areaStart) - start a new area segment.
* [*curve*.areaEnd](https://github.com/d3/d3-shape#curve_areaEnd) - end the current area segment.
* [*curve*.lineStart](https://github.com/d3/d3-shape#curve_lineStart) - start a new line segment.
* [*curve*.lineEnd](https://github.com/d3/d3-shape#curve_lineEnd) - end the current line segment.
* [*curve*.point](https://github.com/d3/d3-shape#curve_point) - add a point to the current line segment.

### [Symbols](https://github.com/d3/d3-shape#symbols)

A categorical shape encoding, as in a scatterplot.

* [d3.symbol](https://github.com/d3/d3-shape#symbol) - create a new symbol generator.
* [*symbol*](https://github.com/d3/d3-shape#_symbol) - generate a symbol for the given datum.
* [*symbol*.type](https://github.com/d3/d3-shape#symbol_type) - set the symbol type.
* [*symbol*.size](https://github.com/d3/d3-shape#symbol_size) - set the size of the symbol in square pixels.
* [*symbol*.context](https://github.com/d3/d3-shape#symbol_context) - set the rendering context.
* [d3.symbols](https://github.com/d3/d3-shape#symbols) - the array of built-in symbol types.
* [d3.symbolCircle](https://github.com/d3/d3-shape#symbolCircle) - a circle.
* [d3.symbolCross](https://github.com/d3/d3-shape#symbolCross) - a Greek cross with arms of equal length.
* [d3.symbolDiamond](https://github.com/d3/d3-shape#symbolDiamond) - a rhombus.
* [d3.symbolSquare](https://github.com/d3/d3-shape#symbolSquare) - a square.
* [d3.symbolStar](https://github.com/d3/d3-shape#symbolStar) - a pentagonal star (pentagram).
* [d3.symbolTriangle](https://github.com/d3/d3-shape#symbolTriangle) - an up-pointing triangle.
* [d3.symbolWye](https://github.com/d3/d3-shape#symbolWye) - an up-pointing triangle.
* [*symbolType*.draw](https://github.com/d3/d3-shape#symbolType_draw) - draw this symbol to the given context.

### [Stacks](https://github.com/d3/d3-shape#stacks)

Stack shapes, placing one adjacent to another, as in a stacked bar chart.

* [d3.stack](https://github.com/d3/d3-shape#stack) - create a new stack generator.
* [*stack*](https://github.com/d3/d3-shape#_stack) - generate a stack for the given dataset.
* [*stack*.keys](https://github.com/d3/d3-shape#stack_keys) - set the keys accessor.
* [*stack*.value](https://github.com/d3/d3-shape#stack_value) - set the value accessor.
* [*stack*.order](https://github.com/d3/d3-shape#stack_order) - set the order accessor.
* [*stack*.offset](https://github.com/d3/d3-shape#stack_offset) - set the offset accessor.
* [d3.stackOrderAscending](https://github.com/d3/d3-shape#stackOrderAscending) - put the smallest series on bottom.
* [d3.stackOrderDescending](https://github.com/d3/d3-shape#stackOrderDescending) - put the largest series on bottom.
* [d3.stackOrderInsideOut](https://github.com/d3/d3-shape#stackOrderInsideOut) - put larger series in the middle.
* [d3.stackOrderNone](https://github.com/d3/d3-shape#stackOrderNone) - use the given series order.
* [d3.stackOrderReverse](https://github.com/d3/d3-shape#stackOrderReverse) - use the reverse of the given series order.
* [d3.stackOffsetExpand](https://github.com/d3/d3-shape#stackOffsetExpand) - normalize the baseline to zero and topline to one.
* [d3.stackOffsetNone](https://github.com/d3/d3-shape#stackOffsetNone) - apply a zero baseline.
* [d3.stackOffsetSilhouette](https://github.com/d3/d3-shape#stackOffsetSilhouette) - center the streamgraph around zero.
* [d3.stackOffsetWiggle](https://github.com/d3/d3-shape#stackOffsetWiggle) - minimize streamgraph wiggling.

## [Time Formats (d3-time-format)](https://github.com/d3/d3-time-format)

Parse and format times, inspired by strptime and strftime.

* [d3.timeFormat](https://github.com/d3/d3-time-format#timeFormat) - alias for enUs.format.
* [d3.timeParse](https://github.com/d3/d3-time-format#timeParse) - alias for enUs.parse.
* [d3.utcFormat](https://github.com/d3/d3-time-format#utcFormat) -  alias for enUs.utcFormat.
* [d3.utcFormat](https://github.com/d3/d3-time-format#utcParse) -  alias for enUs.utcParse.
* [d3.isoFormat](https://github.com/d3/d3-time-format#isoFormat) - an ISO 8601 UTC formatter.
* [d3.isoParse](https://github.com/d3/d3-time-format#isoParse) - an ISO 8601 UTC parser.
* [d3.timeFormatLocale](https://github.com/d3/d3-time-format#locale) - define a custom locale.
* [*locale*.format](https://github.com/d3/d3-time-format#locale_format) - create a time formatter.
* [*locale*.parse](https://github.com/d3/d3-time-format#locale_parse) - create a time parser.
* [*locale*.utcFormat](https://github.com/d3/d3-time-format#locale_utcFormat) - create a UTC formatter.
* [*locale*.utcParse](https://github.com/d3/d3-time-format#locale_utcParse) - create a UTC parser.

## [Time Intervals (d3-time)](https://github.com/d3/d3-time)

A calculator for humanity’s peculiar conventions of time.

* [d3.timeInterval](https://github.com/d3/d3-time#timeInterval) - implement a new custom time interval.
* [*interval*](https://github.com/d3/d3-time#_interval) - alias for *interval*.floor.
* [*interval*.floor](https://github.com/d3/d3-time#interval_floor) - round down to the nearest boundary.
* [*interval*.round](https://github.com/d3/d3-time#interval_round) - round to the nearest boundary.
* [*interval*.ceil](https://github.com/d3/d3-time#interval_ceil) - round up to the nearest boundary.
* [*interval*.offset](https://github.com/d3/d3-time#interval_offset) - offset a date by some number of intervals.
* [*interval*.range](https://github.com/d3/d3-time#interval_range) - generate a range of dates at interval boundaries.
* [*interval*.filter](https://github.com/d3/d3-time#interval_filter) - create a filtered subset of this interval.
* [*interval*.every](https://github.com/d3/d3-time#interval_every) - create a filtered subset of this interval.
* [*interval*.count](https://github.com/d3/d3-time#interval_count) - count interval boundaries between two dates.
* [d3.timeMillisecond](https://github.com/d3/d3-time#timeMillisecond), [d3.utcMillisecond](https://github.com/d3/d3-time#timeMillisecond) - the millisecond interval.
* [d3.timeMilliseconds](https://github.com/d3/d3-time#timeMillisecond), [d3.utcMilliseconds](https://github.com/d3/d3-time#timeMillisecond) - aliases for millisecond.range.
* [d3.timeSecond](https://github.com/d3/d3-time#timeSecond), [d3.utcSecond](https://github.com/d3/d3-time#timeSecond) - the second interval.
* [d3.timeSeconds](https://github.com/d3/d3-time#timeSecond), [d3.utcSeconds](https://github.com/d3/d3-time#timeSecond) - aliases for second.range.
* [d3.timeMinute](https://github.com/d3/d3-time#timeMinute), [d3.utcMinute](https://github.com/d3/d3-time#timeMinute) - the minute interval.
* [d3.timeMinutes](https://github.com/d3/d3-time#timeMinute), [d3.utcMinutes](https://github.com/d3/d3-time#timeMinute) - aliases for minute.range.
* [d3.timeHour](https://github.com/d3/d3-time#timeHour), [d3.utcHour](https://github.com/d3/d3-time#timeHour) - the hour interval.
* [d3.timeHours](https://github.com/d3/d3-time#timeHour), [d3.utcHours](https://github.com/d3/d3-time#timeHour) - aliases for hour.range.
* [d3.timeDay](https://github.com/d3/d3-time#timeDay), [d3.utcDay](https://github.com/d3/d3-time#timeDay) - the day interval.
* [d3.timeDays](https://github.com/d3/d3-time#timeDay), [d3.utcDays](https://github.com/d3/d3-time#timeDay) - aliases for day.range.
* [d3.timeWeek](https://github.com/d3/d3-time#timeWeek), [d3.utcWeek](https://github.com/d3/d3-time#timeWeek) - aliases for sunday.
* [d3.timeWeeks](https://github.com/d3/d3-time#timeWeek), [d3.utcWeeks](https://github.com/d3/d3-time#timeWeek) - aliases for week.range.
* [d3.timeSunday](https://github.com/d3/d3-time#timeSunday), [d3.utcSunday](https://github.com/d3/d3-time#timeSunday) - the week interval, starting on Sunday.
* [d3.timeSundays](https://github.com/d3/d3-time#timeSunday), [d3.utcSundays](https://github.com/d3/d3-time#timeSunday) - aliases for sunday.range.
* [d3.timeMonday](https://github.com/d3/d3-time#timeMonday), [d3.utcMonday](https://github.com/d3/d3-time#timeMonday) - the week interval, starting on Monday.
* [d3.timeMondays](https://github.com/d3/d3-time#timeMonday), [d3.utcMondays](https://github.com/d3/d3-time#timeMonday) - aliases for monday.range.
* [d3.timeTuesday](https://github.com/d3/d3-time#timeTuesday), [d3.utcTuesday](https://github.com/d3/d3-time#timeTuesday) - the week interval, starting on Tuesday.
* [d3.timeTuesdays](https://github.com/d3/d3-time#timeTuesday), [d3.utcTuesdays](https://github.com/d3/d3-time#timeTuesday) - aliases for tuesday.range.
* [d3.timeWednesday](https://github.com/d3/d3-time#timeWednesday), [d3.utcWednesday](https://github.com/d3/d3-time#timeWednesday) - the week interval, starting on Wednesday.
* [d3.timeWednesdays](https://github.com/d3/d3-time#timeWednesday), [d3.utcWednesdays](https://github.com/d3/d3-time#timeWednesday) - aliases for wednesday.range.
* [d3.timeThursday](https://github.com/d3/d3-time#timeThursday), [d3.utcThursday](https://github.com/d3/d3-time#timeThursday) - the week interval, starting on Thursday.
* [d3.timeThursdays](https://github.com/d3/d3-time#timeThursday), [d3.utcThursdays](https://github.com/d3/d3-time#timeThursday) - aliases for thursday.range.
* [d3.timeFriday](https://github.com/d3/d3-time#timeFriday), [d3.utcFriday](https://github.com/d3/d3-time#timeFriday) - the week interval, starting on Friday.
* [d3.timeFridays](https://github.com/d3/d3-time#timeFriday), [d3.utcFridays](https://github.com/d3/d3-time#timeFriday) - aliases for friday.range.
* [d3.timeSaturday](https://github.com/d3/d3-time#timeSaturday), [d3.utcSaturday](https://github.com/d3/d3-time#timeSaturday) - the week interval, starting on Saturday.
* [d3.timeSaturdays](https://github.com/d3/d3-time#timeSaturday), [d3.utcSaturdays](https://github.com/d3/d3-time#timeSaturday) - aliases for saturday.range.
* [d3.timeMonth](https://github.com/d3/d3-time#timeMonth), [d3.utcMonth](https://github.com/d3/d3-time#timeMonth) - the month interval.
* [d3.timeMonths](https://github.com/d3/d3-time#timeMonth), [d3.utcMonths](https://github.com/d3/d3-time#timeMonth) - aliases for month.range.
* [d3.timeYear](https://github.com/d3/d3-time#timeYear), [d3.utcYear](https://github.com/d3/d3-time#timeYear) - the year interval.
* [d3.timeYears](https://github.com/d3/d3-time#timeYear), [d3.utcYears](https://github.com/d3/d3-time#timeYear) - aliases for year.range.

## [Timers (d3-timer)](https://github.com/d3/d3-timer)

An efficient queue for managing thousands of concurrent animations.

* [d3.now](https://github.com/d3/d3-timer#now) - get the current high-resolution time.
* [d3.timer](https://github.com/d3/d3-timer#timer) - schedule a new timer.
* [*timer*.restart](https://github.com/d3/d3-timer#timer_restart) - reset the timer’s start time and callback.
* [*timer*.stop](https://github.com/d3/d3-timer#timer_stop) - stop the timer.
* [d3.timerFlush](https://github.com/d3/d3-timer#timerFlush) - immediately execute any eligible timers.
* [d3.timeout](https://github.com/d3/d3-timer#timeout) - schedule a timer that stops on its first callback.
* [d3.interval](https://github.com/d3/d3-timer#interval) - schedule a timer that is called with a configurable period.

## [Transitions (d3-transition)](https://github.com/d3/d3-transition)

Animated transitions for [selections](#selections).

* [*selection*.transition](https://github.com/d3/d3-transition#selection_transition) - schedule a transition for the selected elements.
* [*selection*.interrupt](https://github.com/d3/d3-transition#selection_interrupt) - interrupt and cancel transitions on the selected elements.
* [d3.transition](https://github.com/d3/d3-transition#transition) - schedule a transition on the root document element.
* [*transition*.select](https://github.com/d3/d3-transition#transition_select) - schedule a transition on the selected elements.
* [*transition*.selectAll](https://github.com/d3/d3-transition#transition_selectAll) - schedule a transition on the selected elements.
* [*transition*.filter](https://github.com/d3/d3-transition#transition_filter) - filter elements based on data.
* [*transition*.merge](https://github.com/d3/d3-transition#transition_merge) - merge this transition with another.
* [*transition*.selection](https://github.com/d3/d3-transition#transition_selection) - returns a selection for this transition.
* [*transition*.transition](https://github.com/d3/d3-transition#transition_transition) - schedule a new transition following this one.
* [*transition*.call](https://github.com/d3/d3-transition#transition_call) - call a function with this transition.
* [*transition*.nodes](https://github.com/d3/d3-transition#transition_nodes) - returns an array of all selected elements.
* [*transition*.node](https://github.com/d3/d3-transition#transition_node) - returns the first (non-null) element.
* [*transition*.size](https://github.com/d3/d3-transition#transition_size) - returns the count of elements.
* [*transition*.empty](https://github.com/d3/d3-transition#transition_empty) - returns true if this transition is empty.
* [*transition*.each](https://github.com/d3/d3-transition#transition_each) - call a function for each element.
* [*transition*.on](https://github.com/d3/d3-transition#transition_on) - add or remove transition event listeners.
* [*transition*.attr](https://github.com/d3/d3-transition#transition_attr) - tween the given attribute using the default interpolator.
* [*transition*.attrTween](https://github.com/d3/d3-transition#transition_attrTween) - tween the given attribute using a custom interpolator.
* [*transition*.style](https://github.com/d3/d3-transition#transition_style) - tween the given style property using the default interpolator.
* [*transition*.styleTween](https://github.com/d3/d3-transition#transition_styleTween) - tween the given style property using a custom interpolator.
* [*transition*.text](https://github.com/d3/d3-transition#transition_text) - set the text content when the transition starts.
* [*transition*.remove](https://github.com/d3/d3-transition#transition_remove) - remove the selected elements when the transition ends.
* [*transition*.tween](https://github.com/d3/d3-transition#transition_tween) - run custom code during the transition.
* [*transition*.delay](https://github.com/d3/d3-transition#transition_delay) - specify per-element delay in milliseconds.
* [*transition*.duration](https://github.com/d3/d3-transition#transition_duration) - specify per-element duration in milliseconds.
* [*transition*.ease](https://github.com/d3/d3-transition#transition_ease) - specify the easing function.
* [d3.active](https://github.com/d3/d3-transition#active) - select the active transition for a given node.
* [d3.interrupt](https://github.com/d3/d3-transition#interrupt) -

## [Voronoi Diagrams (d3-voronoi)](https://github.com/d3/d3-voronoi)

Compute the Voronoi diagram of a given set of points.

* [d3.voronoi](https://github.com/d3/d3-voronoi#voronoi) - create a new Voronoi generator.
* [*voronoi*](https://github.com/d3/d3-voronoi#_voronoi) - generate a new Voronoi diagram for the given points.
* [*voronoi*.polygons](https://github.com/d3/d3-voronoi#voronoi_polygons) - compute the Voronoi polygons for the given points.
* [*voronoi*.triangles](https://github.com/d3/d3-voronoi#voronoi_triangles) - compute the Delaunay triangles for the given points.
* [*voronoi*.links](https://github.com/d3/d3-voronoi#voronoi_links) - compute the Delaunay links for the given points.
* [*voronoi*.x](https://github.com/d3/d3-voronoi#voronoi_x) - set the *x* accessor.
* [*voronoi*.y](https://github.com/d3/d3-voronoi#voronoi_y) - set the *y* accessor.
* [*voronoi*.extent](https://github.com/d3/d3-voronoi#voronoi_extent) - set the observed extent of points.
* [*voronoi*.size](https://github.com/d3/d3-voronoi#voronoi_size) - set the observed extent of points.

## [Zooming (d3-zoom)](https://github.com/d3/d3-zoom)

Pan and zoom SVG, HTML or Canvas using mouse or touch input.

* [d3.zoom](https://github.com/d3/d3-zoom#zoom) -
* [*zoom*](https://github.com/d3/d3-zoom#_zoom) -
* [*zoom*.transform](https://github.com/d3/d3-zoom#zoom_transform) -
* [*zoom*.translateBy](https://github.com/d3/d3-zoom#zoom_translateBy) -
* [*zoom*.scaleBy](https://github.com/d3/d3-zoom#zoom_scaleBy) -
* [*zoom*.scaleTo](https://github.com/d3/d3-zoom#zoom_scaleTo) -
* [*zoom*.filter](https://github.com/d3/d3-zoom#zoom_filter) -
* [*zoom*.extent](https://github.com/d3/d3-zoom#zoom_extent) -
* [*zoom*.scaleExtent](https://github.com/d3/d3-zoom#zoom_scaleExtent) -
* [*zoom*.translateExtent](https://github.com/d3/d3-zoom#zoom_translateExtent) -
* [*zoom*.duration](https://github.com/d3/d3-zoom#zoom_duration) -
* [*zoom*.on](https://github.com/d3/d3-zoom#zoom_on) -
* [d3.zoomTransform](https://github.com/d3/d3-zoom#zoomTransform) -
* [*transform*.scale](https://github.com/d3/d3-zoom#transform_scale) -
* [*transform*.translate](https://github.com/d3/d3-zoom#transform_translate) -
* [*transform*.apply](https://github.com/d3/d3-zoom#transform_apply) -
* [*transform*.applyX](https://github.com/d3/d3-zoom#transform_applyX) -
* [*transform*.applyY](https://github.com/d3/d3-zoom#transform_applyY) -
* [*transform*.invert](https://github.com/d3/d3-zoom#transform_invert) -
* [*transform*.invertX](https://github.com/d3/d3-zoom#transform_invertX) -
* [*transform*.invertY](https://github.com/d3/d3-zoom#transform_invertY) -
* [*transform*.rescaleX](https://github.com/d3/d3-zoom#transform_rescaleX) -
* [*transform*.rescaleY](https://github.com/d3/d3-zoom#transform_rescaleY) -
* [*transform*.toString](https://github.com/d3/d3-zoom#transform_toString) -
* [d3.zoomIdentity](https://github.com/d3/d3-zoom#zoomIdentity) -
