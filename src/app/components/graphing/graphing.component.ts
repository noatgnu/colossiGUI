/* tslint:disable:no-string-literal only-arrow-functions */
import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {D3, D3Service, Transition} from 'd3-ng2-service';


@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit, AfterViewInit {
  private d3: D3;
  private parentNativeElement: any;
  @Input() standardData;
  @Input() userData;
  @Input() demo = true;
  constructor(element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    const d3 = this.d3;
    let d3ParentElement;
    if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement);
    }

    const width = 900;
    const height = 400;

    const margin = {top: 20, right: 10, bottom: 20, left: 40};

    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;
    if (this.demo) {
      const {data, globalCounts, groupCounts} = this.generateDemoData(d3);
      const {yScale, xScale, g} = this.drawBoxplot(d3, width, height, d3ParentElement, totalWidth, totalHeight, margin, globalCounts, data, groupCounts);
      const circles = g.selectAll('circle').data(Object.keys(groupCounts)).enter().append('circle').attr('r', 3.5).attr('stroke-width', '1')
        .attr('stroke', '#000').attr('fill', '#000').attr('cy', function(datum) {
        const randomData = groupCounts[datum][Math.floor(Math.random() * groupCounts[datum].length)];
        return yScale(randomData);
      }).attr('cx', function(datum) {
        return xScale(datum) + xScale.bandwidth() / 2;
      });
    }
  }

  private drawBoxplot(d3, width: number, height: number, d3ParentElement, totalWidth, totalHeight, margin, globalCounts, data, groupCounts) {
    const min = d3.min(globalCounts);
    const max = d3.max(globalCounts);
    console.log(min, max);
    const xScale = d3.scaleBand().domain(Object.keys(groupCounts)).rangeRound([0, width]).padding(0.7);
    const yScale = d3.scaleLinear().domain([min, max]).range([height, 0]);
    const barWidth = xScale.bandwidth();
    const svg = d3ParentElement
      .append('svg').attr('width', totalWidth)
      .attr('height', totalHeight);
    const svgGroup = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const axisG = svgGroup.append('g');
    const axisBottomG = svgGroup.append('g');
    const g = svgGroup.append('g');

    const verticalLines = g.selectAll('.verticalLines').data(data).enter().append('line')
      .attr('x1', function(datum) {
        return xScale(datum.key) + barWidth / 2;
      }).attr('y1', function(datum) {
        return yScale(datum.whiskers[0]);
      }).attr('x2', function(datume) {
        return xScale(datume.key) + barWidth / 2;
      }).attr('y2', function(datum) {
        return yScale(datum.whiskers[1]);
      }).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none');

    const rects = g.selectAll('rect').data(data).enter().append('rect').attr('width', barWidth).attr('height', function(datum) {
      return yScale(datum.quartile[0]) - yScale(datum.quartile[2]);
    }).attr('x', function(datum) {
      return xScale(datum.key);
    }).attr('y', function(datum) {
      return yScale(datum.quartile[2]);
    }).attr('fill', function(datum) {
      return datum.color;
    }).attr('stroke', '#000').attr('stroke-width', 1);

    const horizontalLineFunctions = [
      {
        x1: function(datum) {
          return xScale(datum.key);
        },
        y1: function(datum) {
          return yScale(datum.whiskers[0]);
        },
        x2: function(datum) {
          return xScale(datum.key) + barWidth;
        },
        y2: function(datum) {
          return yScale(datum.whiskers[0]);
        }
      },
      {
        x1: function(datum) {
          return xScale(datum.key);
        },
        y1: function(datum) {
          return yScale(datum.quartile[1]);
        },
        x2: function(datum) {
          return xScale(datum.key) + barWidth;
        },
        y2: function(datum) {
          return yScale(datum.quartile[1]);
        }
      },
      {
        x1: function(datum) {
          return xScale(datum.key);
        },
        y1: function(datum) {
          return yScale(datum.whiskers[1]);
        },
        x2: function(datum) {
          return xScale(datum.key) + barWidth;
        },
        y2: function(datum) {
          return yScale(datum.whiskers[1]);
        }
      },
    ];

    for (const i of horizontalLineFunctions) {
      const horizontalLine = g.selectAll('.whiskers').data(data).enter().append('line').attr('x1', i.x1).attr('y1', i.y1).attr('x2', i.x2).attr('y2', i.y2)
        .attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none');
    }

    const axisLeft = d3.axisLeft(yScale);
    axisG.append('g').call(axisLeft);
    const axisBottom = d3.axisBottom(xScale);
    axisBottomG.append('g').attr('transform', 'translate(0,' + (height) + ')').call(axisBottom);
    return {yScale, xScale, g};
  }

  boxQuartiles(d3, d) {
    return [
      d3.quantile(d, .25),
      d3.quantile(d, .5),
      d3.quantile(d, .75)
    ];
  }

  sortNumber(a, b) {
    return a - b;
  }

  generateDemoData(d3) {
    const groupCounts = {};
    const globalCounts = [];
    const meanGenerator = d3.randomUniform(10);
    for (let i = 0; i < 10; i++) {
      const randomMean = meanGenerator();
      const generator = d3.randomNormal(randomMean);
      const key = i.toString();
      groupCounts[key] = [];
      for (let j = 0; j < 100; j++) {
        const entry = generator();
        groupCounts[key].push(entry);
        globalCounts.push(entry);
      }
    }

    for (const key of Object.keys(groupCounts)) {
      groupCounts[key] = groupCounts[key].sort(this.sortNumber);
    }

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(Object.keys(groupCounts));

    const data = [];
    for (const [key, groupCount] of Object.entries(groupCounts)) {
      const record = {};
      const localMin = d3.min(groupCount);
      const localMax = d3.max(groupCount);
      record['key'] = key;
      record['counts'] = groupCount;
      record['quartile'] = this.boxQuartiles(d3, groupCount);
      record['whiskers'] = [localMin, localMax];
      record['color'] = colorScale(key);
      data.push(record);
    }
    return {data, globalCounts, groupCounts};

  }
}
