import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import dotenv from "dotenv";

dotenv.config();

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: 'http://localhost:3000/auth/google/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Getting the refresh token and stuff', accessToken, refreshToken, profile);
      done(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});
