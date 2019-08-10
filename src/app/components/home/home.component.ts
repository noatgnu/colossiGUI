import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  formData: FormData;
  constructor(private fb: FormBuilder) { }

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
  }

  upload() {
    this.formData.set('extra_params', new Blob([JSON.stringify(this.form.value)], {type: 'application/json'}));
    console.log(this.formData);
  }
}
