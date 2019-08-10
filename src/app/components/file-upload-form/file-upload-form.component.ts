import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss']
})
export class FileUploadFormComponent implements OnInit {
  formData: FormData;
  @Output() fileEvent: EventEmitter<FormData> = new EventEmitter<FormData>();
  fileName: string;
  constructor() { }

  ngOnInit() {
  }

  fileChange(e) {
    this.formData = new FormData();
    for (const f of e.target.files) {
      this.fileName = f.name;
      this.formData.append('files', f, f.name);
    }
    this.fileEvent.emit(this.formData);
  }
}
