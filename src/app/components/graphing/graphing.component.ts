/* tslint:disable:no-string-literal */
import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {D3, D3Service} from 'd3-ng2-service';

@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit, AfterViewInit {

  private d3: D3;
  private parentNativeElement: any;
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
    const barWidth = 30;
    const margin = {top: 20, right: 10, bottom: 20, left: 10};

    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;

    const groupCounts = {};
    const globalCounts = [];
    const meanGenerator = d3.randomUniform(10);
    for (let i = 0; i < 7; i++) {
      const randomMean = meanGenerator();
      const generator = d3.randomNormal(randomMean);
      const key = i.toString();
      groupCounts[key] = [];
      for (let j = 0; j < 100; j++) {
        const entry = generator();
        groupCounts[key].push(entry);
      }
    }

    for (const key of Object.keys(groupCounts)) {
      groupCounts[key] = groupCounts[key].sort(this.sortNumber);
    }


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
    for (let i = 0; i < 7; i++) {
      const randomMean = meanGenerator();
      const generator = d3.randomNormal(randomMean);
      const key = i.toString();
      groupCounts[key] = [];
      for (let j = 0; j < 100; j++) {
        const entry = generator();
        groupCounts[key].push(entry);
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
    }
  }
}
