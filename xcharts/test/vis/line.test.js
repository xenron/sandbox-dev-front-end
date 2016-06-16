(function () {

  var container = '#chart',
    mData = {
      main: [{
        label: 'Foobar',
        data: [
          { x: 1, y: -1 },
          { x: 2, y: 2 }
        ],
        className: 'foo_line'
      }],
      xScale: 'ordinal',
      yScale: 'linear'
    };

  beforeEach(function () {
    $('#scratch').find(container).remove().end()
      .append('<div id="chart" style="height: 100px; width: 100px;" />');
  });

  describe('enter()', function () {
    var chart;

    before(function () {
      $('#scratch').find(container).remove().end()
        .append('<div id="chart" style="height: 100px; width: 100px;" />');
      chart = new xChart('line', mData, container);
    });

    it('creates storage.lineContainers', function () {
      expect(chart._mainStorage.lineContainers).to.not.be(undefined);
    });

    it('creates storage.bars', function () {
      expect(chart._mainStorage.linePaths).to.not.be(undefined);
    });

    it('creates storage.lineX and storage.lineY', function () {
      expect(chart._mainStorage.lineX).to.not.be(undefined);
      expect(chart._mainStorage.lineY).to.not.be(undefined);
    });

    it('creates storage.line', function () {
      expect(chart._mainStorage.line).to.not.be(undefined);
    });

    it('adds attribute data-index="3"', function () {
      var g = chart._g.select('g.line');
      expect(g.attr('data-index')).to.be('3');
    });

    it('draws below and above yZero', function () {
      var line = chart._g.select('.line path.line');
      // yZero is between the y-values of the d attribute
      expect(chart.yZero).to.be(45);
      expect(line.attr('d')).to.be('M20,60L20,15');
    });

    it('does not round x-values', function () {
      var data = {
          main: [{
            label: 'Foobar',
            data: [
              { x: 1, y: 1 },
              { x: 1.2, y: -1 },
              { x: 1.6, y: -1 },
              { x: 2.1, y: 2 }
            ],
            className: 'foo_line'
          }],
          xScale: 'linear',
          yScale: 'linear'
        },
        first,
        second,
        third,
        fourth;

      $(container).width(400);
      chart = new xChart('line-dotted', data, container);

      first = $('circle:eq(0)')[0].getBoundingClientRect();
      second = $('circle:eq(1)')[0].getBoundingClientRect();
      third = $('circle:eq(2)')[0].getBoundingClientRect();
      fourth = $('circle:eq(3)')[0].getBoundingClientRect();

      expect(first.left).to.not.equal(second.left);
      expect(third.left).to.not.equal(fourth.left);
    });
  });

  describe('update()', function () {
    // TODO
  });

  describe('exit()', function () {
    // TODO
  });

  describe('destroy()', function () {
    // TODO
  });
}());
