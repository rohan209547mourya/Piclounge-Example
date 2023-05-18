const express = require('express');
const router = express.Router();
const {
    registerNewUser,
    loginUser,
    verifyOneTimePassword
} = require('../controller/authenticationController');
const ImageKit = require('imagekit');


const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})


router.post('/register', registerNewUser);
router.post('/login', loginUser);
router.post('/account/verify', verifyOneTimePassword);


router.get('/imagekit/signature', (req, res) => {

    const response = imageKit.getAuthenticationParameters();
    res.send(response);
});


module.exports = router;