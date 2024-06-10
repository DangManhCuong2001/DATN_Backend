require("dotenv").config();

var GoogleStrategy = require("passport-google-oauth20").Strategy;
const loginWithGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        //   callbackURL: "http://www.example.com/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log("profile", profile);
        //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        //   });
      }
    )
  );
};
export default loginWithGoogle;
