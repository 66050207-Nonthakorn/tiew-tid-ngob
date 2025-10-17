import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20" 

function config() {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        // Handle Google user
        done(null, {
            id: profile.id,
            provider: "google",
            email: profile.emails![0].value
        });
    }));
}

export default { config };