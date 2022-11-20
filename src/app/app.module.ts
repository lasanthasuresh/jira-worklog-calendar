import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { FormsModule } from '@angular/forms';
import { ViewEventModalComponent } from './view-event-modal/view-event-modal.component';
import { SideBarComponent } from './side-bar/side-bar.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    AddEventModalComponent,
    ViewEventModalComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FullCalendarModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
