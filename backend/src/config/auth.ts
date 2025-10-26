import { OAuth2Client } from "google-auth-library";

const googleOAuth = new OAuth2Client({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET
});

export default googleOAuth;