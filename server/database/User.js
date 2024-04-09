const mongoose = require('mongoose');
const { isEmail } = require('validator');
const encrypt = require('../utils/encrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'User Name is required']
    }, password: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'Password is required'],
        minlength: [8, 'Minimum password length is 8 characters']
    }, email: {
        type: mongoose.SchemaTypes.String,
        unique: [true, 'Email is already registered, try to Log In'],
        lowercase: true,
        required: [true, 'Email is Required'],
        validate: [isEmail, 'Please enter a valid email']
    }, createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date()
    }, admin: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
        default: false
    }
});


//fire a function after doc save to db

// UserSchema.post('save', function (doc, next){
//     console.log(doc);
//     next();
// });

//fire a function before doc save to db

UserSchema.pre('save', function (next) {
    this.password = encrypt.hashPassword(this.password);
    next();
});


//static method to login user

UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = encrypt.comparePassword(password, user.password);
        if (auth) {
            return user;
        } else {
            throw Error('Incorrect Password');
        }
    } else {
        throw Error("Incorrect Email");
    }
}

module.exports = mongoose.model('users', UserSchema);