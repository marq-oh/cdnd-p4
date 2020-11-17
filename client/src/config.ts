// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'bo1k3plb47'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-w3cr2kre.auth0.com',            // Auth0 domain
  clientId: 'Lg1344wQihIv9jb6QxabrYB9SnidZSxK',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
