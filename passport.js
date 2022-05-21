import JwtStrategy from 'passport-jwt/lib/strategy.js'; 
import { ExtractJwt } from 'passport-jwt/lib/index.js';
import User from './register.js';
import passport from 'passport';

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'Key';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
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