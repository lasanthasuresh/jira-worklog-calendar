import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JiraService } from '../jira.service';
import { ProfileProviderService } from '../profile-provider.service';
import { WorklogService } from '../worklog.service';

@Component ({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: [ './add-event-modal.component.scss' ]
})
export class AddEventModalComponent implements OnInit {

  @Input ()
  public input: any;
  @Output ()
  saved: EventEmitter<any> = new EventEmitter ();
  @Output ()
  canceled: EventEmitter<any> = new EventEmitter ();

  hasMultipleDates: boolean;

  dataModel = {
    ticket: '',
    summary: '',
    affectingDate: null,
    affectingDateList: [],
    affectingDates: '',
    timeStarted: null,
    timeSpent: '',
    comment: ''
  };


  constructor(
    public activeModal: NgbActiveModal,
    private jiraService: JiraService,
    private worklogService: WorklogService,
    private profileProvider: ProfileProviderService
  ) {
  }

  public acceptParameters(prams){
    const startDateStr = prams.startStr.substring (0, 10);
    const endDateStr = prams.endStr.substring (0, 10);
    this.hasMultipleDates = startDateStr !== endDateStr;
    if (this.hasMultipleDates) {
      console.log (prams.start, prams.end);
      for (
        let date = new Date (startDateStr);
        date < new Date (endDateStr);
        date.setDate (date.getDate () + 1)
      ) {
        this.dataModel.affectingDateList.push (new Date (date));
      }
      this.dataModel.affectingDates = this.dataModel.affectingDateList.map (it => it.toISOString ().split ('T')[0]).join (', ');
      this.dataModel.timeSpent = '8h';
      this.dataModel.timeStarted = '09:00';
    } else {
      this.dataModel.affectingDateList = [ prams.start ];
      this.dataModel.affectingDate = prams.start;
      this.dataModel.timeSpent = this.countMinutes (prams.start, prams.end);
      this.dataModel.timeStarted = prams.startStr.substring (11, 16);

    }
  }

  refreshTicket(value: any) {
    this.jiraService.getIssueSummary (value, this.profileProvider.userAccount)
      .then (s => {
        this.dataModel.summary = s;
        this.dataModel.ticket = value;
      }).catch (error => {
      console.log (error);
      this.dataModel.summary = '[error]';
    });
  }

  ngOnInit(): void {
  }

  cancel() {
    this.activeModal.close ('cancel');
    this.canceled.emit ('cancel');
  }

  async save() {
    // return;
    await this.worklogService.saveWorkflows (this.getWorklogs());
    this.activeModal.close ('saved');
    this.saved.emit ('saved');
  }

  private getWorklogs() {
    if (this.hasMultipleDates) {
      return this.dataModel.affectingDateList.map (it => ( {
        ticketId: this.dataModel.ticket,
        timeSpent: this.dataModel.timeSpent,
        comment: this.dataModel.comment,
        started: this.convertToTime (it, this.dataModel.timeStarted),
      } ));
    } else {
      return [{
        ticketId: this.dataModel.ticket,
        timeSpent: this.dataModel.timeSpent,
        comment: this.dataModel.comment,
        started: this.convertToTime (this.dataModel.affectingDate, this.dataModel.timeStarted)
      }];
    }
  }

  private convertToTime(date, time) {
    const datePart = date.toISOString ().split ('T')[0];
    const timePart = time;
    const d = new Date (`${ datePart }T${ timePart }`);
    return d.toISOString ().replace ('Z', '+0000');

    // return '';//date.toISOString().split("T")[0] + 'T' +
  }

  private countMinutes(start, end) {
    const diff = end - start;
    const minutes = Math.round (( ( diff % 86400000 ) ) / 60000);
    if (minutes < 60) {
      return `${ minutes }m`;
    }
    if (minutes % 60 === 0) {
      return `${ minutes / 60 }h`;
    }
    return `${ ( minutes - ( minutes % 60 ) ) / 60 }h ${ minutes % 60 }m`;
  }

}
