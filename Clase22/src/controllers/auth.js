import passport  from 'passport'
import bcrypt from 'bcrypt'
import {Strategy as LocalStrategy} from 'passport-local'
import {User} from '../persistence/models/modelUser.js'
import logger from "../utils/logger.js";

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ 'username': username }, function (err, user) {
    
        if (err) {
          logger.error("Error in SignUp: " + err);
          return done(err);
        }
    
        if (user) {
          logger.info('User already exists');
          return done(null, false)
        }
        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        }
        User.create(newUser, (err, userWithId) => {
            if (err) {
              console.log('Error in Saving user: ' + err);
              return done(err);
            }
            logger.info('User Registration succesful');
            return done(null, userWithId);
          });
        });
  })
)

passport.use('login', new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err)
        return done(err);
      if (!user) {
        logger.error('User Not Found with username ' + username);
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        logger.error('Invalid Password');
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}
     
function createHash(password) {
  return bcrypt.hashSync( password, bcrypt.genSaltSync(10), null);
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

export default passport