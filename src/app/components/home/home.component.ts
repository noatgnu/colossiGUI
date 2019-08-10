import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {FileUploadService} from '../../service/file-upload.service';
import {AnnouncementService} from '../../service/announcement.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  formData: FormData;
  constructor(private fb: FormBuilder, private fileUpload: FileUploadService, private announce: AnnouncementService) { }

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

  upload() {
    this.formData.set('extra_params', new Blob([JSON.stringify(this.form.value)], {type: 'application/json'}));
    this.announce.updateAnnouncement('Processing...');
    this.fileUpload.postFormData(this.formData).subscribe((response) => {
      this.announce.updateAnnouncement('Completed.');
    });
  }
}
