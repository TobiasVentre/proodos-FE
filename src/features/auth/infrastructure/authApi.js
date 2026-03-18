export class AuthApi {
  constructor(httpClient, authBaseUrl) {
    this.httpClient = httpClient;
    this.authBaseUrl = authBaseUrl.replace(/\/+$/, "");
  }

  login({ username, password }) {
    return this.httpClient.request({
      method: "POST",
      url: `${this.authBaseUrl}/auth/login`,
      body: { username, password }
    });
  }

  async refresh(refreshToken) {
    return this.httpClient.request({
      method: "POST",
      url: `${this.authBaseUrl}/auth/refresh`,
      body: { refreshToken }
    });
  }

  logout(refreshToken) {
    return this.httpClient.request({
      method: "POST",
      url: `${this.authBaseUrl}/auth/logout`,
      body: { refreshToken }
    });
  }
}
