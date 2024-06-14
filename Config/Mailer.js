const nodeMailer = require('nodemailer')

const sendUserOtp = async (Otp, FullName, Email) => {
  const messageTemplate = `<div>
 <div>
   <h2 style="color: red;"> Reset Your Password </h2>
 </div>
 <ul>
   <li>Name: ${FullName}</li>
   <li>Email: ${Email}</li>
 </ul>
 <div>
   <p>
     Dear ${FullName},
   </p>
   <p>
   Hello,

   </p>
   <p>
   We have sent you this email in response to your request to reset your password on company name.
   </p>
   <p>     
   To reset your password, Your OTP is : ${Otp}
   </p>
 </div>
 <p style="color: black;"><i> Urgent Buy </i></p>
</div>
`

  const trasporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: Email,
    subject: 'Reset Your Password',
    html: messageTemplate,
    text: `Hello ${FullName}`
  }

  try {
    trasporter.sendMail(mailOptions)
    console.log('Email sent successfully');

  } catch (error) {
    console.log('Email couldnt send unfortunately', error);
  }




}


const signUpMssg = async (FullName, Email) => {
  const messageTemplate = `<div>
  <div>
    <h2 style="color: red;">     Welcome to [Your App Name]!  </h2>
  </div>
  <ul>
    <li>Name: ${FullName}</li>
    <li>Email: ${Email}</li>
  </ul>
  <div>
    <p>
      Dear ${FullName},
    </p>
    <p>
    We're excited to have you on board. Explore our curated range of skincare products, enjoy special member discounts, and get personalized recommendations just for you.
    </p>
    <p>
    Happy shopping!
    Best,
   The [Your App Name] Team
    </p>
    <p>     
    P.S. Follow us on [social media links] for updates and exclusive offers!
    </p>
  </div>
  <p style="color: black;"><i> Urgent Buy </i></p>
 </div>
 `

  const trasporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: Email,
    subject: 'Welcome',
    html: messageTemplate,
    text: `Hello ${FullName}`
  }

  try {
    trasporter.sendMail(mailOptions)
    console.log('Email sent successfully');

  } catch (error) {
    console.log('Email couldnt send unfortunately', error);
  }




}

module.exports = {sendUserOtp , signUpMssg}