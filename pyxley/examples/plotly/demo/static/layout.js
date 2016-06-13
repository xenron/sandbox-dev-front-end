
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { FilterChart as Component} from 'pyxley';
    var filter_style = "''";
var dynamic = true;
var charts = [{"type": "PlotlyAPI", "options": {"chartid": "plotlyid", "url": "/plotlyurl/", "params": {"Data": "Steps"}}}];
var filters = [{"type": "SelectButton", "options": {"default": "Steps", "items": ["Calories Burned", "Steps", "Distance", "Floors", "Minutes Sedentary", "Minutes Lightly Active", "Minutes Fairly Active", "Minutes Very Active", "Activity Calories"], "alias": "Data", "label": "Data"}}];
    ReactDOM.render(
        <Component
        filter_style = { filter_style }
dynamic = { dynamic }
charts = { charts }
filters = { filters } />,
        document.getElementById("component_id")
    );
    