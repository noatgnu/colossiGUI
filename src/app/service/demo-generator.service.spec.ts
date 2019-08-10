import { TestBed } from '@angular/core/testing';

import { DemoGeneratorService } from './demo-generator.service';

describe('DemoGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemoGeneratorService = TestBed.get(DemoGeneratorService);
    expect(service).toBeTruthy();
  });
});
