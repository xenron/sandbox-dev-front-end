/**
 * @file Brush action
 */
define(function(require) {

    var echarts = require('../../echarts');

    /**
     * payload: {
     *      brushIndex: number, or,
     *      brushId: string, or,
     *      brushName: string,
     *      globalRanges: Array
     * }
     */
    echarts.registerAction(
         {type: 'brush', event: 'brush', update: 'updateView'},
        function (payload, ecModel) {
            ecModel.eachComponent({mainType: 'brush', query: payload}, function (brushModel) {
                brushModel.setBrushRanges(payload.brushRanges);
            });
        }
    );

    /**
     * payload: {
     *      brushIndex: number, or,
     *      brushId: string, or,
     *      brushName: string,
     *      brushOption: Object
     * }
     */
    echarts.registerAction(
         {type: 'enableBrush', event: 'brushEnabled', update: 'update'},
        function (payload, ecModel) {
            ecModel.eachComponent({mainType: 'brush', query: payload}, function (brushModel) {
                brushModel.setBrushOption(payload.brushOption);
            });
        }
    );
});