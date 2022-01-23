interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  silentCallbackURL: string;
  audience: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'Y9WWSwFSwUkeZNiBPfsdCg21Sf7qRoex',
  domain: 'dev-5b04zxtm.us.auth0.com',
  callbackURL: 'http://localhost:4200/callback',
  silentCallbackURL: 'http://localhost:4200/silent',
  audience: 'http://localhost:4200',
  apiUrl: 'http://localhost:3000'
};
