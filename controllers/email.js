const nodemailer = require('nodemailer');
const Util = require( '../libs/util' );
const config   = require( '../libs/config');

// its a generic function for demo only.
function validation(email) {
  if (
    !email || 
        (Util.myTrim(email) === '' || !Util.isValidEmail(email))
  ) {
    return { error: true, msg: 'Must type a valid email.'};
  }
  return { error: false };
}

async function processEmail(email, firstName = '', lastName = ''){
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth:{
        user: config.NODEMAILER_USERNAME,
        pass: config.NODEMAILER_PWD,
      }
    });
    
    await transporter.sendMail({
      from: `${firstName} <${lastName}>`,
      to: email,
      subject: 'New message for contact',
      html: `Some info: <br>
                First Name: ${firstName}<br>
                Last Name: ${lastName}<br>`
    });
    return { msg: 'Send correct email!' };
  } catch (err) {
    console.log('Failure', err);
    return { error: true, msg: 'Error on sending email, please try again later.' };
  }
}
const sendEmail = async (res, email) => {
  const valObj = validation(email);
  if (valObj.error) {
    res.status( 400 ).sendData( { msg: valObj.msg } ); 
  } else {
    try {
      const resultado = await processEmail(email);
      if (resultado.error) {
        res.status( 500 ).sendData( { msg: resultado.msg } );                     
      } else {
        res.status( 200 ).sendData( { msg: resultado.msg } );
      }
    } catch (err) {
      console.log(err);
      res.status( 500 ).sendData( { msg: 'There was an error processing the email.' } ); 
    }
  }
};

const sendEmailGet = async (req, res)  => {
  if (req.query) {
    const email = req.query.email;
    await sendEmail(res, email);
  } else {
    res.status( 400 ).sendData( { msg: 'The email field is required.' } ); 
  }
};

const sendEmailPost = async (req, res) => {
  const fields = req.body; // user postman client with Body x-www-form-urlencoded to pass params
  if (fields.email) {
    const email = fields.email;
    await sendEmail(res, email);
  } else {
    res.status( 400 ).sendData( { msg: 'The email field is required.' } ); 
  }
};

module.exports = {
  sendEmailGet,
  sendEmailPost,
};


