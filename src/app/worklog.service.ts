import { Injectable } from '@angular/core';
import { ProfileProviderService } from './profile-provider.service';
import { JiraService } from './jira.service';
import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';

@Injectable ({
  providedIn: 'root'
})
export class WorklogService {

  allWorklogs = undefined;

  constructor (
    private profileService: ProfileProviderService,
    private jiraService: JiraService
  ) {
  }


  getWorkLogById (id) {
    return this.allWorklogs.find (it => it.id === id);
  }

  async reloadWorklogs () {
    this.allWorklogs = await this.jiraService.getAllWorklogs (this.profileService.userAccount);
  }

  async events (fromDate: Date, toDate: Date) {
    if (this.allWorklogs === undefined) {
      this.allWorklogs = await this.jiraService.getAllWorklogs (this.profileService.userAccount);
    }
    const toReturn = this.allWorklogs
      .filter (it => this.isInDateRange (it, fromDate, toDate))
      .map (this.toEvent);
    console.log (toReturn);
    return toReturn;
  }

  async saveWorkflows (workflow: { timeSpent: string; comment: string; started: string; ticketId: string }[]) {
    const workflows = await Promise.all (
      workflow.map (
        it => this.jiraService.createWorklog (
          it,
          this.profileService.userAccount
        )
      )
    );
    await this.reloadWorklogsForTickets (workflow.map (it => it.ticketId));
  }

  async reloadWorklogsForTickets (ticketIds: string[]) {
    const worklogs = await this.jiraService.getAllWorklogs (this.profileService.userAccount, ticketIds);

    for ( const worklog of worklogs ) {
      const index = this.allWorklogs.findIndex (it => it.id === worklog.id);
      if (index === -1) {
        this.allWorklogs.push (worklog);
      } else {
        this.allWorklogs[index] = worklog;
      }
    }
  }

  async resizeWorklog (id, startDelta, endDelta) {
    const index = this.allWorklogs.findIndex (it => it.id === id);
    const worklog = this.allWorklogs[index];
    worklog.timeSpentSeconds += endDelta;
    await this.jiraService.updateWorklog (worklog, this.profileService.userAccount);
    await this.reloadWorklogsForTickets ([ worklog.ticketKey ]);
  }

  async moveWorklog (id, days: number, seconds: number) {
    const index = this.allWorklogs.findIndex (it => it.id === id);
    const worklog = this.allWorklogs[index];
    if (days !== 0) {
      worklog.started.setDate (worklog.started.getDate () + days);
    } else {
      worklog.started.setSeconds (worklog.started.getSeconds () + seconds);
    }
    await this.jiraService.updateWorklog (worklog, this.profileService.userAccount);
    await this.reloadWorklogsForTickets ([ worklog.ticketKey ]);
  }


  async updateWorklog (param: { date: Date; comment: string; id: any }) {
    const index = this.allWorklogs.findIndex (it => it.id === param.id);
    const worklog = this.allWorklogs[index];
    worklog.commentStr = param.comment;
    worklog.started= param.date
    await this.jiraService.updateWorklog (worklog, this.profileService.userAccount);
    await this.reloadWorklogsForTickets ([ worklog.ticketKey ]);
  }

  async deleteWorklog (id) {
    const worklog = this.getWorkLogById (id);
    await this.jiraService.deleteWorklog (worklog, this.profileService.userAccount);
    this.allWorklogs = this.allWorklogs.filter (it => it.id !== id);
  }

  private toEvent (worklog) {
    return {
      start: worklog.started,
      end: worklog.end,
      title: `${ worklog.ticketKey } - ${ worklog.ticketSummary } (${ worklog.timeSpent })`,
      description: worklog.commentStr,
      id: worklog.id,
      issueId: worklog.issueId
    };
  }

  private isInDateRange (worklog, fromDate, toDate) {
    return worklog.started >= fromDate && worklog.end <= toDate;
  }


}
