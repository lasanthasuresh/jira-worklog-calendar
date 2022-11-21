import { Injectable } from '@angular/core';
import { AccountInfo } from './account-info';
// import Store from 'electron-store';

const urlBase = 'https://alliontechnologies.atlassian.net';
const username = 'sureshp@alliontechnologies.com';
const password = '3tZ4VlMfxrLIC3fatD6NF549';
const accountId = '622f0c518c349300687afddc';

// const store = new Store ();

const CURRENT_ACCOUNT = 'current-account';

@Injectable ({
  providedIn: 'root'
})
export class ProfileProviderService {

  private account: AccountInfo = undefined;

  constructor() {
  }

  get currentAccount(): AccountInfo {
    if (this.account === undefined) {
      const accountStr = localStorage.get (CURRENT_ACCOUNT) as string;
      if (accountStr) {
        this.account = JSON.parse (accountStr);
      } else {
        this.account = null;
      }
    }
    return this.account;
  }

  async setUserProfile(profile: AccountInfo, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem(CURRENT_ACCOUNT,JSON.stringify(profile));
      // store.set (CURRENT_ACCOUNT, JSON.stringify (profile));
    }
    this.account = profile;
  }

  resetProfile() {
    this.account = undefined;
    localStorage.removeItem(CURRENT_ACCOUNT);
    // store.delete (CURRENT_ACCOUNT);
  }
}
