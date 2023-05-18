const {
    User, validateUser
} = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'piclounge.developer@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }  
});


const registerNewUser = async (req, res, next) => {

    const requestBody = req.body;

    try {
        const isRequestBodyValid = validateUser(requestBody);

        if (isRequestBodyValid.error) {
            return res.status(400).json({
                message: isRequestBodyValid.error.details[0].message,
                status: 400
            });
        }
    } catch (err) {
        
        return res.status(400).json({
            message: "bad request",
            status: 400
        });
    }

    const isEmailAlreayExist = await User.findOne({
        email: requestBody.email
    });

    if (isEmailAlreayExist) {
        return res.status(400).json({
            message: "Email already exist",
            status: 400
        });
    }

    const isUsernameAlreayExist  = await User.findOne({
        username: requestBody.username
    })

    if (isUsernameAlreayExist) {
        return res.status(400).json({
            message: "Username already exist",
            status: 400
        });
    }

    const newUser = new User({
        name: requestBody.name,
        username: requestBody.username,
        email: requestBody.email,
        dateOfBirth: requestBody.dateOfBirth,
    })


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(requestBody.password, salt);

    newUser.password = hashedPassword;

    const opt = otpGenerator.generate(4, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    newUser.oneTimePassword = opt;

    try {
        await newUser.save();
    } catch (err) {
        next(err);
    }


    const mailOptions = {
        from: 'piclounge.developer@gmail.com',
        to: `${newUser.email}`,
        subject: 'Pic Lounge - Email Verification',
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your login</title>
        </head>
        
        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
          <table role="presentation"
            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
            <tbody>
              <tr>
                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                  <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                    <tbody>
                      <tr>
                        <td style="padding: 40px 0px 0px;">
                          <div style="text-align: left;">
                            <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/yFH213t/logo.png" alt="Company" style="width: 56px;"></div>
                          </div>
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: left;">
                              <h1 style="margin: 1rem 0">Verification code</h1>
                              <p style="padding-bottom: 16px">Welcome, <strong> ${newUser.name} </strong> to Pic Lounge.</p>
                              <p style="padding-bottom: 16px">Please use the verification code below to verify your email.</p>
                              <p style="padding-bottom: 16px"><strong style="font-size: 130%">${opt}</strong></p>
                              <p style="padding-bottom: 16px">If you didn't asked for email verification, you can ignore this email.</p>
                              <p style="padding-bottom: 16px">Thanks,<br>The Pic Lounge team</p>
                            </div>
                          </div>
                          <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                            <p style="padding-bottom: 16px">Powered by ❤️ Pic Lounge</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        
        </html>`
      };
      

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error)
            return res.status(500).json({
                message: "Something went wrong, please report issue at piclounge.developer@gmail.com",
                status: 500
            });
        } else {
            console.info('Email Send Successfully')

            delete newUser.password;

            return res.status(200).json({
                message: "User created successfully",
                status: 200,
                data: {
                    user: newUser
                }
            });
        }
      });
}


const verifyOneTimePassword = async (req, res, next) => {

    const requestBody = req.body;

    const user = await User.findOne({
        email: requestBody.email
    });

    if (!user) {
        return res.status(400).json({
            message: "User not found",
            status: 400
        });
    }

    if(user.isEmailVerified) {
        return res.status(400).json({
            message: "User already verified",
            status: 400
        });
    }

    if (user.oneTimePassword == requestBody.oneTimePassword) {
        user.isEmailVerified = true;
        user.oneTimePassword = "";
        await user.save();

        const token = user.generateAuthToken();
        delete user.password;

        return res.status(200).json({
            message: "User verified successfully",
            status: 200,
            data: {
                token: token,
                user: user
            }
        });
    } else {
        return res.status(400).json({
            message: "Invalid one time password",
            status: 400
        });
    }
}


const loginUser = async (req, res, next) => {

    const requestBody = req.body;
    let user = null;


    if (requestBody.usernameOrEmail?.includes("@")) {
        user = await User.findOne({ 
            email: requestBody.usernameOrEmail
        });
    }
    else{
        user = await User.findOne({ 
            username: requestBody.usernameOrEmail
        });
    }



    if (!user) {
        return res.status(400).json({
            message: "User not found",
            status: 400
        });
    }

    const isPasswordValid = await bcrypt.compare(requestBody.password, user.password);
    
    if (isPasswordValid) {

            if(user.isEmailVerified) {

            const token = user.generateAuthToken();
            delete user.password;

            return res.status(200).json({
                message: "User logged in successfully",
                status: 200,
                data: {
                    token: token,
                    user: user
                }
            });
        }  else {

            console.log(user);
            return res.status(400).json({
                message: "User not verified",
                status: 400,
                data: {
                    user: user
                }
            });
        }
        
    }else {
            return res.status(400).json({
                message: "Invalid password",
                status: 400
            });
        }
   
}


module.exports = {
    registerNewUser,
    verifyOneTimePassword,
    loginUser
}
