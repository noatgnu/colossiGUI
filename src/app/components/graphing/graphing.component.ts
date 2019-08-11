/* tslint:disable:no-string-literal only-arrow-functions object-literal-shorthand */
import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {D3, D3Service, Transition} from 'd3-ng2-service';
import {ResultService} from '../../service/result.service';
import {Subscribable, Subscription} from 'rxjs';


@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit, AfterViewInit, OnDestroy {
  private d3: D3;
  private parentNativeElement: any;
  result;
  @Input() standardData: Array<number>;
  @Input() userData: Array<number>;
  @Input() metricName;
  @Input() demo = false;
  @Input() width = 200;
  @Input() height = 250;
  metricSub: Subscription;
  margin = {top: 20, right: 10, bottom: 20, left: 40};
  totalWidth = this.width + this.margin.left + this.margin.right;
  totalHeight = this.height + this.margin.top + this.margin.bottom;
  groupCounts = {};
  globalCounts = [];


  constructor(element: ElementRef, d3Service: D3Service, private resultService: ResultService) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.result = this.resultService.getResultStorage();


    if (this.metricName === undefined) {
      this.userData = [this.result['summaryStats'][0]['Freq']];
      this.metricName = this.result['summaryStats'][0]['Var1'];
    }

    this.standardData = Object.values(this.result['compareDataframe'][this.metricName]);
    this.metricSub = this.resultService.metricReader.subscribe((response) => {
      const result = this.resultService.getResultStorage();

      for (let i = 0; i < result['summaryStats'].length; i++) {

        if (response === result['summaryStats'][i]['Var1']) {
          this.metricName = response;
          this.userData = [result['summaryStats'][i]['Freq']];
          this.standardData = result['compareDataframe'][i];
          const d3ParentElement = this.d3.select(this.parentNativeElement);
          console.log(response);
          d3ParentElement.select('svg').remove();
          this.draw(this.d3, this.width, this.height,  d3ParentElement, this.totalWidth, this.totalHeight, this.margin);
          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.metricSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    const d3 = this.d3;
    let d3ParentElement;
    if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement);
    }

    const width = this.width;
    const height = this.height;

    const margin = {top: 20, right: 10, bottom: 20, left: 40};

    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;
    this.draw(d3, width, height, d3ParentElement, totalWidth, totalHeight, margin);
  }

  private draw(d3, width, height, d3ParentElement, totalWidth, totalHeight, margin) {
    if (this.demo) {
      const {data, globalCounts, groupCounts} = this.generateDemoData(d3);
      const {yScale, xScale, g} = this.drawBoxplot(d3, width, height, d3ParentElement, totalWidth, totalHeight, margin, globalCounts, data, groupCounts);
      const circles = g.selectAll('circle').data(Object.keys(groupCounts)).enter().append('circle').attr('r', 3.5).attr('stroke-width', '1')
        .attr('stroke', '#000').attr('fill', '#000').attr('cy', function(datum) {
          const randomData = groupCounts[datum][Math.floor(Math.random() * groupCounts[datum].length)];
          return yScale(randomData);
        }).attr('cx', function(datum) {
          return xScale(datum) + xScale.bandwidth() / 2;
        }).exit();
    } else {
      const globalCounts = [];
      for (const i of this.standardData) {
        globalCounts.push(i);
      }
      for (const i of this.userData) {
        globalCounts.push(i);
      }
      const groupCounts = {};
      groupCounts[this.metricName] = this.standardData;
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(Object.keys(groupCounts));
      const record = {};
      const localMin = d3.min(this.standardData);
      const localMax = d3.max(this.standardData);
      record['key'] = this.metricName;
      record['counts'] = this.standardData;
      record['quartile'] = this.boxQuartiles(d3, this.standardData);
      record['whiskers'] = [localMin, localMax];
      record['color'] = colorScale(this.metricName);
      const data = [record];
      const {yScale, xScale, g} = this.drawBoxplot(d3, width, height, d3ParentElement, totalWidth, totalHeight, margin, globalCounts, data, groupCounts);
      const circles = g.selectAll('circle').data(this.userData).enter().append('circle').attr('r', 3.5).attr('stroke-width', '1')
        .attr('stroke', '#000').attr('fill', '#000').attr('cy', function(datum) {
          return yScale(datum);
        }).attr('cx', function(datum) {
          return xScale(record['key']) + xScale.bandwidth() / 2;
        }).exit();
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
    const meanGenerator = d3.randomUniform(100);
    for (let i = 0; i < 1; i++) {
      const randomMean = meanGenerator();
      const generator = d3.randomNormal(randomMean);
      const key = i.toString();
      groupCounts[key] = [];
      for (let j = 0; j < 300; j++) {
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
