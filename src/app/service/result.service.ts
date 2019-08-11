import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private resultSource: Subject<unknown> = new Subject<unknown>();
  resultReader = this.resultSource.asObservable();
  private metricSource: Subject<unknown> = new Subject<unknown>();
  metricReader = this.metricSource.asObservable();
  private resultStorage;
  constructor() { }

  updateResult(data) {
    this.resultStorage = data;
    this.resultSource.next(data);
  }

  getResultStorage() {
    return this.resultStorage;
  }

  updateMetric(data) {
    this.metricSource.next(data);
  }
}
