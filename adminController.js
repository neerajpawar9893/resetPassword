const Admin = require('../model/adminModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
      api_key: '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'
    }
  }));

exports.getLogin =(req, res, next) => {
res.render('index',{
    title: 'Login',
    path: '/',
    isAuth: req.session.isLoggedIn
})
};

exports.getSignup =(req, res, next) => {
    res.render('signup',{
        title: 'Signup',
        path: '/signup',
        isAuth: req.session.isLoggedIn
    })
};

exports.postLogin =(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Admin.findOne({email: email}).then(user => {
        if(!user){
            return res. redirect('/signup');
        }
        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.save(err => {
                    // console.log(err);
                    res.redirect('/colonyList')
                })
            }
        })

    }).catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password
    Admin.findOne({email: email})
    .then(userMatch=> {
        if(userMatch){
           return res.redirect('/');
        }
        bcrypt.hash(password, 12)
        .then(hashPassword => {
            const admin = new Admin({
                email: email,
                password: hashPassword
            })
            admin.save()
            .then(result => {
                res.redirect('/');
                console.log('Signup Success');
            })
        })
    }) 
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
};

exports.getReset =(req, res, next) => {
    res.render('reset',{
        title: 'Reset Password',
        isAuth: req.session.isLoggedIn,
        path: '/reset'
    })
};

exports.postReset= (req, res, next) =>{
    crypto.randomBytes(32, (err, buffer) => {
      if(err){
        console.log(err);
        return res.redirect('/');
      }
      const token = buffer.toString('hex');
      Admin.findOne({email: req.body.email})
      .then(admin => {
        if(!admin){
          return res.redirect('/reset');
        }
        admin.resetToken = token;
        console.log(admin.resetToken);
        admin.resetTokenExpiration = Date.now() + 3600000;
        return admin.save();
      }).then(result => {
       res.redirect('/');
       transporter.sendMail({
         to: req.body.email,
         from: 'neerajpawar9893@gmail.com',
         subject: 'Password reset',
         html: `
         <p>You request password reset</p>
         <p>Click this<a href="http://localhost:3000/reset/">link</a> to reset password </p>
         `
      })
     })
      .catch(err => {
        console.log(err);
      });
    })
   };
   
   exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    Admin.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        res.render('newPassword',{
            title: 'New Password',
            path: '/newPassword',
            isAuth: req.session.isLoggedIn,
            userId: user._id.toString(),
            passwordToken: token
        })
    })
    .catch(err => {
        console.log(err)
    })
   };

   exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    Admin.findOne({resetToken: passwordToken, _id: userId, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
    }).then(hashPassword => {
        resetUser.password = hashPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save()
    }).then(result => {
        res.redirect('/');
    })
    .catch(err => console.log(err));
};