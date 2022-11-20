import { Injectable } from '@angular/core';

const urlBase = 'https://alliontechnologies.atlassian.net';
const username = 'sureshp@alliontechnologies.com';
const password = '3tZ4VlMfxrLIC3fatD6NF549';
const accountId = '622f0c518c349300687afddc';
const account = {
  urlBase,
  password,
  username,
  accountId
};

@Injectable ({
  providedIn: 'root'
})
export class ProfileProviderService {
  userAccount = {
    urlBase,
    password,
    username,
    accountId
  };

  constructor () {
  }
}
