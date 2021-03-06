import wrapper from 'utils/wrapper';
import tokenController from 'controllers/tokenController';

/**
 * When the user clicks Log Out
 */

const handler = async (req, res) => {

  try {
    res.locals.access_token = req.cookies.access_token;

    /* Get user_id from token */
    await tokenController.getTokenData(req, res);
    if (res.finished) return;
    /* Delete access token on client and db */
    await tokenController.deleteAccessToken(req, res);
    if (res.finished) return;

    /* Delete access token from browser */
    res.cookie('access_token');
    
    res.sendCookies();
    return res.json({});
  } 
  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);
