import { Component, OnInit } from '@angular/core';
import { JiraService } from '../jira.service';
import { ProfileProviderService } from '../profile-provider.service';
import { filter } from 'rxjs';

@Component ({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: [ './side-bar.component.scss' ]
})
export class SideBarComponent implements OnInit {
  tickets = [];
  filter: string;

  constructor (private profileService: ProfileProviderService, private jiraService: JiraService) {
  }

  get filteredTickets () {
    return this.tickets.filter (it => !Boolean (this.filter) ||
      it.key.toLowerCase ().includes (this.filter) ||
      it.summary.toLowerCase ().includes (this.filter)
    );
  }

  ngOnInit (): void {
    this.jiraService.getRecentlyViewedTickets (this.profileService.userAccount).then (data => {
      console.log (data);
      this.tickets = data;
    });
  }
}
