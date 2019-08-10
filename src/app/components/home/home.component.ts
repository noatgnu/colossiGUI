import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {FileUploadService} from '../../service/file-upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  formData: FormData;
  constructor(private fb: FormBuilder, private fileUpload: FileUploadService) { }

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
    console.log(this.formData);
    this.fileUpload.postFormData(this.formData).subscribe((response) => {
      console.log(response);
    });
  }
}
