import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import { Router } from '@angular/router';

import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private signIn: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private router: Router) {
    this.signIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      },
      // KEY for OIE embedded widget
      useInteractionCodeFlow: true
    });
  }

  async ngOnInit(): Promise<void> {
    this.signIn.remove();

  try {
    const tokens = await this.signIn.showSignInToGetTokens({
      el: '#okta-sign-in-widget'
    });

    this.oktaAuth.tokenManager.setTokens(tokens);
    this.signIn.remove();
    this.router.navigateByUrl('/products');
  } catch (err: any) {
    console.error('WIDGET ERROR:', err);
    // many okta errors have: err.errorSummary, err.errorCauses, err.xhr.responseText
    console.error('summary:', err?.errorSummary);
    console.error('xhr:', err?.xhr?.responseText);
  }
  }

  ngOnDestroy(): void {
    this.signIn.remove();
  }
}