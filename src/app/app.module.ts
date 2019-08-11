import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {D3Service} from 'd3-ng2-service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { FileUploadFormComponent } from './components/file-upload-form/file-upload-form.component';
import { GraphingComponent } from './components/graphing/graphing.component';
import {FileUploadService} from './service/file-upload.service';
import {HttpClientModule} from '@angular/common/http';
import { DotPlotComponent } from './components/dot-plot/dot-plot.component';
import {DemoGeneratorService} from './service/demo-generator.service';
import {AnnouncementService} from './service/announcement.service';
import {ResultService} from './service/result.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FileUploadFormComponent,
    GraphingComponent,
    DotPlotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [D3Service, FileUploadService, DemoGeneratorService, AnnouncementService, ResultService],
  bootstrap: [AppComponent]
})
export class AppModule { }
