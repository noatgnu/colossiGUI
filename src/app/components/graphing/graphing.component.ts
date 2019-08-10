import {Component, ElementRef, OnInit} from '@angular/core';
import {D3Service} from 'd3-ng2-service';

@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit {

  constructor(element: ElementRef, d3Service: D3Service) { }

  ngOnInit() {
  }

}
