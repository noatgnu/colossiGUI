import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private annoucementSource: BehaviorSubject<string> = new BehaviorSubject<string>('Ready for data submission');
  annoucementReader = this.annoucementSource.asObservable();
  constructor() { }

  updateAnnouncement(data) {
    this.annoucementSource.next(data);
  }
}
