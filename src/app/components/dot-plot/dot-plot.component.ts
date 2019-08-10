import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {D3, D3Service, Transition} from 'd3-ng2-service';
import {DemoGeneratorService} from '../../service/demo-generator.service';
@Component({
  selector: 'app-dot-plot',
  templateUrl: './dot-plot.component.html',
  styleUrls: ['./dot-plot.component.scss']
})
export class DotPlotComponent implements OnInit, AfterViewInit {
  private d3: D3;
  private parentNativeElement: any;

  @Input() userData;
  @Input() demo = true;
  constructor(element: ElementRef, d3Service: D3Service, private demoData: DemoGeneratorService) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    const d3 = this.d3;
    if (this.demo) {
      this.userData = this.demoData.dotPlotData(d3);
    }
    let d3ParentElement;
    if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement);
    }

    const width = 900;
    const height = 400;

    const margin = {top: 20, right: 10, bottom: 20, left: 40};

    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;
    const uniqueGroup = [];
    const globalCounts = [];
    for (const i of this.userData) {
      if (uniqueGroup.indexOf(i.label) >= 0) {
        uniqueGroup.push(i.label);
      }
      globalCounts.push(i);
    }
    const minX = d3.min(globalCounts, function(d) {
      return d.x;
    });
    const maxX = d3.max(globalCounts, function(d) {
      return d.x;
    });
    const minY = d3.min(globalCounts, function(d) {
      return d.y;
    });
    const maxY = d3.max(globalCounts, function(d) {
      return d.y;
    });
    console.log(minY, maxY);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(uniqueGroup);
    const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width]);
    const yScale = d3.scaleLinear().domain([minY, maxY]).range([height, 0]);
    const svg = d3ParentElement.append('svg').attr('width', totalWidth)
      .attr('height', totalHeight);
    const svgGroup = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const axisG = svgGroup.append('g');
    const axisBottomG = svgGroup.append('g');
    const g = svgGroup.append('g');
    const axisLeft = d3.axisLeft(yScale);
    axisG.append('g').call(axisLeft);
    const axisBottom = d3.axisBottom(xScale);
    axisBottomG.append('g').attr('transform', 'translate(0,' + (height) + ')').call(axisBottom);
    const dotPlot = g.selectAll('circle').data(globalCounts).enter().append('circle').attr('cx', function(d) {
      return xScale(d.x);
    }).attr('cy', function(d) {
      return yScale(d.y);
    }).attr('fill', function(d) {
      return colorScale(d.label);
    }).attr('stroke', function(d) {
      return colorScale(d.label);
    }).attr('r', 2.5);
  }

}
