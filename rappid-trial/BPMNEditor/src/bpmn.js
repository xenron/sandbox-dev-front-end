/*! Rappid v1.7.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2016-03-03 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


var inspector;

/* GRAPH */

var graph = new joint.dia.Graph({ type: 'bpmn' }).on({

    // this is happening before the view of the model is actually added into the paper
    'add': function(cell, collection, opt) {

        if (!opt.stencil) return;

        var type = cell.get('type');

        // some types of the elements need resizing after they are dropped
        var sizeMultiplier = { 'bpmn.Pool': 8, 'bpmn.Choreography': 2 }[type];

        if (sizeMultiplier) {
            var originalSize = cell.get('size');
            cell.set('size', {
                width: originalSize.width * sizeMultiplier,
                height: originalSize.height * sizeMultiplier
            }, { silent: true });
        }
    }

});

var commandManager = new joint.dia.CommandManager({ graph: graph });

/* PAPER + SCROLLER */

var paper = new joint.dia.Paper({
    width: 2000,
    height: 2000,
    model: graph,
    gridSize: 10,
    model: graph,
    perpendicularLinks: true,
    defaultLink: new joint.shapes.bpmn.Flow,
    validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

        // don't allow loop links
        if (cellViewS == cellViewT) return false;

        var view = (end === 'target' ? cellViewT : cellViewS);

        // don't allow link to link connection
        if (view instanceof joint.dia.LinkView) return false;

        return true;
    },
    embeddingMode: true,
    frontParentOnly: false,
    validateEmbedding: function(childView, parentView) {
        var Pool = joint.shapes.bpmn.Pool;
        return (parentView.model instanceof Pool) && !(childView.model instanceof Pool);
    }

}).on({

    'blank:pointerdown': function(evt, x, y) {

        if (_.contains(KeyboardJS.activeKeys(), 'shift')) {
            selectionView.startSelecting(evt, x, y);
        } else {
            selectionView.cancelSelection();
            paperScroller.startPanning(evt, x, y);
        }
    },

    'cell:pointerdown': function(cellView, evt) {

        // Select an element if CTRL/Meta key is pressed while the element is clicked.
        if ((evt.ctrlKey || evt.metaKey) && cellView.model instanceof joint.dia.Element && !(cellView.model instanceof joint.shapes.bpmn.Pool)) {
            selection.add(cellView.model);
            selectionView.createSelectionBox(cellView);
        }
    },

    'cell:pointerup': openTools
});

var paperScroller = new joint.ui.PaperScroller({
    autoResizePaper: true,
    padding: 50,
    paper: paper
});

paperScroller.$el.appendTo('#paper-container');
paperScroller.center();

/* SELECTION */

var selection = new Backbone.Collection;

var selectionView = new joint.ui.SelectionView({
    paper: paper,
    graph: graph,
    model: selection,
    filter: ['bpmn.Pool'] // don't allow to select a pool

}).on({

    'selection-box:pointerdown': function(evt) {
        // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
        if (evt.ctrlKey || evt.metaKey) {
            var cell = selection.get($(evt.target).data('model'));
            selection.reset(selection.without(cell));
            selectionView.destroySelectionBox(paper.findViewByModel(cell));
        }
    }
});

/* STENCIL */

var stencil = new joint.ui.Stencil({
    graph: graph,
    paper: paper
});

stencil.render().$el.appendTo('#stencil-container');

stencil.load([
    new joint.shapes.bpmn.Gateway,
    new joint.shapes.bpmn.Activity,
    new joint.shapes.bpmn.Event,
    new joint.shapes.bpmn.Annotation,
    // a groups and pools can't be connected with any other elements
    new joint.shapes.bpmn.Pool({
        attrs: {
            '.': { magnet: false },
            '.header': { fill: '#5799DA' }
        },
        lanes: { label: 'Pool' }
    }),
    new joint.shapes.bpmn.Group({
        attrs: {
            '.': { magnet: false },
            '.label': { text: 'Group' }
        }
    }),
    new joint.shapes.bpmn.Conversation,
    new joint.shapes.bpmn.Choreography({
        participants: ['Participant 1', 'Participant 2']
    }),
    new joint.shapes.bpmn.Message,
    new joint.shapes.bpmn.DataObject
]);

joint.layout.GridLayout.layout(stencil.getGraph(), {
    columns: 100,
    columnWidth: 110,
    rowHeight: 110,
    dy: 20,
    dx: 20,
    resizeToFit: true
});

stencil.getPaper().fitToContent(0, 0, 10);

// Create tooltips for all the shapes in stencil.
stencil.getGraph().get('cells').each(function(cell) {
    new joint.ui.Tooltip({
        target: '.stencil [model-id="' + cell.id + '"]',
        content: cell.get('type').split('.')[1],
        bottom: '.stencil',
        direction: 'bottom',
        padding: 0
    });
});

/* CELL ADDED: after the view of the model was added into the paper */
graph.on('add', function(cell, collection, opt) {

    // TODO: embedding after an element is dropped from the stencil. There is a problem with
    // the command manager and wrong order of actions (embeding, parenting, adding and as it
    // must be 3,1,2) in one batch. Can't be done silently either (becoming an attribute
    // of an element being added) because redo action of `add` (=remove) won't reset the parent embeds.

    if (!opt.stencil) return;

    // open inspector after a new element dropped from stencil
    var view = paper.findViewByModel(cell);
    if (view) openTools(view);
});

/* KEYBOARD */

KeyboardJS.on('delete, backspace', function(evt) {

    if (!$.contains(evt.target, paper.el)) return;

    commandManager.initBatchCommand();
    selection.invoke('remove');
    commandManager.storeBatchCommand();
    selectionView.cancelSelection();
});

// Disable context menu inside the paper.
// This prevents from context menu being shown when selecting individual elements with Ctrl in OS X.
paper.el.oncontextmenu = function(evt) { evt.preventDefault(); };


$('#toolbar-container [data-tooltip]').each(function() {

    new joint.ui.Tooltip({
        target: this,
        content: $(this).data('tooltip'),
        top: '#toolbar-container',
        direction: 'top'
    });
});

function openTools(cellView) {
    // No need to re-render inspector if the cellView didn't change.
    if (!inspector || inspector.options.cellView !== cellView) {

        if (inspector) {
            // Clean up the old inspector if there was one.
            inspector.remove();
        }

        var type = cellView.model.get('type');

        inspector = new joint.ui.Inspector({
                cellView: cellView,
                inputs: inputs[type],
                groups: {
                    general: { label: type, index: 1 },
                    appearance: { index: 2 }
                }
            });

        $('#inspector-container').prepend(inspector.render().el);
    }

    if (cellView.model instanceof joint.dia.Element && !selection.contains(cellView.model)) {

        new joint.ui.FreeTransform({ cellView: cellView }).render();

        new joint.ui.Halo({
                cellView: cellView,
                boxContent: function(cellView) {
                    return cellView.model.get('type');
                }
            }).render();

        selectionView.cancelSelection();
        selection.reset([cellView.model], { safe: true });
    }
}

function showStatus(message, type) {

    $('.status').removeClass('info error success').addClass(type).html(message);
    $('#statusbar-container').dequeue().addClass('active').delay(3000).queue(function() {
        $(this).removeClass('active');
    });
};

var toolbar = {

    toJSON: function() {

        var windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no';
        var windowName = _.uniqueId('json_output');
        var jsonWindow = window.open('', windowName, windowFeatures);

        jsonWindow.document.write(JSON.stringify(graph.toJSON()));
    },

    loadGraph: function() {

        gdAuth(function() {

            showStatus('loading..', 'info');
            gdLoad(function(name, content) {
                try {
                    var json = JSON.parse(content);
                    graph.fromJSON(json);
                    document.getElementById('fileName').value = name.replace(/.json$/, '');
                    showStatus('loaded.', 'success');
                } catch (e) {
                    showStatus('failed.', 'error');
                }
            });

        }, true);
    },

    saveGraph: function() {

        gdAuth(function() {

            showStatus('saving..', 'info');
            var name = document.getElementById('fileName').value;
            gdSave(name, JSON.stringify(graph.toJSON()), function(file) {

                if (file) {
                    showStatus('saved.', 'success');
                } else {
                    showStatus('failed.', 'error');
                }
            });

        }, true);
    }
};

// load an example graph
graph.fromJSON(example);
