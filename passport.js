// Import all the modules required
import JwtStrategy from 'passport-jwt/lib/strategy.js'; 
import { ExtractJwt } from 'passport-jwt/lib/index.js';
import User from './register.js';
import passport from 'passport';

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extracting JWT token from teh request using ExtractJWT module.
opts.secretOrKey = 'Key'; // Security key for JWT token defined already in boards file while initializing the token.

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // Finding the user in the database file for authentication using JWTStrategy
    User.findOne({where: {id: jwt_payload.id}}).then(user => {
        if(user){
            return done(null, user);
        }else {
            return done(null, false);
            // or you could create a new account
        }
    })
}));

export default passport;