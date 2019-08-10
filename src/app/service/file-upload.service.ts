import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Result} from '../class/result';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private backEndUrl = 'http://localhost:9000/';
  private resultSource = new Subject<Result>();
  resultReader = this.resultSource.asObservable();

  constructor(private http: HttpClient) { }

  postFormData(f: FormData) {
    return this.http.post(this.backEndUrl + 'data/upload', f, {observe: 'response'});
  }

  updateResult(data) {
    this.resultSource.next(data);
  }
}
