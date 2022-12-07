import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountInfo } from '../account-info';
import { JiraService } from '../jira.service';
import { ProfileProviderService } from '../profile-provider.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component ({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {

  @Output ()
  public loggedIn = new EventEmitter<AccountInfo> ();

  loginProfiler = {
    endpointUrl: '',
    email: '',
    accessToken: '',
    rememberMe: false,
  };

  public helpLoaded = false;

  constructor(private jiraService: JiraService, private modalService: NgbModal, private userProfileService: ProfileProviderService) {
  }

  ngOnInit(): void {
  }

  goToHelpPage() {

  }

  async tryLogin() {
    const profile = {
      urlBase: this.loginProfiler.endpointUrl,
      username: this.loginProfiler.email,
      password: this.loginProfiler.accessToken,
      accountId: '',
      displayName: '',
      avatarUrl: ''
    };
    const jiraProfile = await this.jiraService.getProfile (profile);
    if (jiraProfile) {
      profile.accountId = jiraProfile.accountId;
      profile.displayName = jiraProfile.displayName;
      await this.userProfileService.setUserProfile (profile, this.loginProfiler.rememberMe);
      this.loggedIn.next (profile);
    }
  }

  showHelp( content ) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title' });
  }

  hideme() {
    this.helpLoaded = true;
  }
}
