import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {FileUploadService} from '../../service/file-upload.service';
import {AnnouncementService} from '../../service/announcement.service';
import {ResultService} from '../../service/result.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  formData: FormData;
  resultObservable: Observable<unknown>;
  constructor(private fb: FormBuilder, private fileUpload: FileUploadService, private announce: AnnouncementService,
              private result: ResultService) {
    this.resultObservable = this.result.resultReader;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      info: '',
    });
  }

  fileEventHandler(e: FormData) {
    this.formData = e;
    console.log(this.formData);
  }

  sendBoxPlotData(metricName) {
    this.result.updateMetric(metricName);
  }

  upload() {
    this.formData.set('extra_params', new Blob([JSON.stringify(this.form.value)], {type: 'application/json'}));
    this.announce.updateAnnouncement('Processing...');
    this.fileUpload.postFormData(this.formData).subscribe((response) => {
      this.result.updateResult(response['body']);
      this.announce.updateAnnouncement('Completed.');
    });
  }
}
