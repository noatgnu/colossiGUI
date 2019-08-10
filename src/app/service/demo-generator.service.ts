import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DemoGeneratorService {

  constructor() { }

  dotPlotData(d3) {
    const demoData = [];
    const meanGeneratorX = d3.randomUniform(100);
    const meanGeneratorY = d3.randomUniform(100);
    for (let i = 0; i < 10; i++) {
      const randomMeanX = meanGeneratorX();
      const generatorX = d3.randomNormal(randomMeanX);
      const randomMeanY = meanGeneratorY();
      const generatorY = d3.randomNormal(randomMeanY);
      const key = i.toString();
      for (let j = 0; j < 30; j++) {
        demoData.push({label: key, x: generatorX(), y: generatorY()});
      }
    }
    return demoData;
  }
}
