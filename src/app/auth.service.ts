import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_URL = "http://localhost:8080"// FIXME

  async requestAuthenticationUrl() {
    const response = await fetch(`${this.AUTH_URL}/oauth2/authorization/spotify`, {
      credentials: 'include'
    })
    const json = await response.json()
    return json.redirectUrl
  }

  async authenticate() {
    // assuming the backend will redirect to the frontend location
    window.location = await this.requestAuthenticationUrl();
  }

}
