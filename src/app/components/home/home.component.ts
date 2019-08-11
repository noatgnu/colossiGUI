import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {FileUploadService} from '../../service/file-upload.service';
import {AnnouncementService} from '../../service/announcement.service';
import {ResultService} from '../../service/result.service';
import {Observable} from 'rxjs';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-home',
  animations: [
    trigger('initialize', [
      state('hidden', style({
        opacity: 0,
      })), state('reveal', style({
        opacity: 1,
      })), transition('hidden => reveal', [animate('2s')]),
    ]),
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  formData: FormData;
  resultObservable: Observable<unknown>;
  isHidden = true;
  showAllToggle = false;
  metric = [];
  color = {0: 'table-danger', 1: 'table-success'};
  toggle() {
    this.isHidden = !this.isHidden;
  }

  constructor(private fb: FormBuilder, private fileUpload: FileUploadService, private announce: AnnouncementService,
              private result: ResultService) {
    this.resultObservable = this.result.resultReader;
  }

  ngOnInit() {
    this.createForm();
    this.toggle();
  }

  createForm(): void {
    this.form = this.fb.group({
      cellType: [],
      dataType: 'microarray',
      organism: 'human',
      database: 'stemformatics'
    });
  }

  fileEventHandler(e: FormData) {
    this.formData = e;
    console.log(this.formData);
  }

  sendBoxPlotData(metricName) {
    console.log(metricName);
    this.result.updateMetric(metricName);
  }

  upload() {
    this.formData.set('extra_params', new Blob([JSON.stringify(this.form.value)], {type: 'application/json'}));
    this.announce.updateAnnouncement('Processing...');
    this.fileUpload.postFormData(this.formData).subscribe((response) => {
      this.result.updateResult(response['body']);
      this.metric = Object.keys(response['body']);
      this.announce.updateAnnouncement('Completed.');
    });
  }

  showAllBoxPlot() {
    this.showAllToggle = !this.showAllToggle;
  }
}
