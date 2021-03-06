import wrapper from 'utils/wrapper';
import tokenController from 'controllers/tokenController';
import loginController from 'controllers/loginController';
import signupController from 'controllers/signupController';

/**
 * When the user clicks Reset Password
 */

const handler = async (req, res) => {

  try {
    res.locals.password = req.body.password;
    res.locals.confirmPassword = req.body.confirmPassword;
    res.locals.emailOrUsername = req.body.email;
    res.locals.entryType = 'email';

    /* Return User Data - use it to authenticate */
    await loginController.returnUserData(req, res);
    if (res.finished) return;
    /* Validate Password */
    await signupController.validatePassword(req, res);
    if (res.finished) return;
    /* Hash Password */
    await signupController.hashPassword(req, res);
    if (res.finished) return;
    /* Update Password */
    await loginController.updatePassword(req, res);
    if (res.finished) return;
    /* Create Access Token */
    await tokenController.createAccessToken(req, res);
    if (res.finished) return;

    res.sendCookies();
    return res.json({
      loggedIn: true,
      username: res.locals.username
    });
  } 
  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);
