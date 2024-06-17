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


const orderPendingMssg = async (FullName, Email, OrderNumber, TotalAmount, OrderDate, Order, tag) => {
  let orders = Order.split(',')
  const orderItems = orders.map(order => `<li>${order.trim()}</li>`).join('')

  const messageTemplate = `<div>
  <div>
    <h2 style="color: red;">Your Order is Pending</h2>
  </div>
  <ul>
    <li>Name: ${FullName}</li>
    <li>Email: ${Email}</li>
    <li>Reference Number: ${OrderNumber}</li>
  </ul>
  <div>
    <p>Dear ${FullName},</p>
    <p>
      Thank you for your purchase! Your order with tag ${tag} is currently being processed. Below are the details of your order:
    </p>
    <ul>
      <li>Order Number: ${OrderNumber}</li>
      <li>Order Date: ${OrderDate}</li>
      <li>Total Amount: ${TotalAmount}</li>
    </ul>

    <ul>
     ${orderItems}
  </ul>
    <p>
      We will notify you once your order is successful. If you have any questions or need further assistance, please do not hesitate to contact our customer support.
    </p>
    <p>
      Best,
      The [Your App Name] Team
    </p>
    <p>
      P.S. Follow us on [social media links] for updates and exclusive offers!
    </p>
  </div>
  <p style="color: black;"><i>Urgent Buy</i></p>
</div> `


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
    subject: 'Order Information',
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




const finalOrderStatusMssg = async (FullName, Email, OrderNumber, TotalAmount, OrderDate, Order, tag, status) => {
  // let orders = Order.split(',');
  // const orderItems = orders.map(order => `<li>${order.trim()}</li>`).join('');

  // // Determine the status message and email subject based on the order status
  // let statusMessage = '';
  // let subject = '';

  // if (status === 'success') {
  //   statusMessage = `
  //       <p>
  //         We are pleased to inform you that your order has been successfully processed and will be shipped to you shortly. Below are the details of your order:
  //       </p>`;
  //   subject = 'Your Order is Successful';
  // } else if (status === 'failed') {
  //   statusMessage = `
  //       <p>
  //         We regret to inform you that there was an issue processing your order. Please contact our customer support for further assistance. Below are the details of your order:
  //       </p>`;
  //   subject = 'Your Order Processing Failed';
  // }

  const messageTemplate = `
      <div>
        <div>
          <h2 style="color: red;">Order Status Update</h2>
        </div>
        <ul>
          <li>Name: ${FullName}</li>
          <li>Email: ${Email}</li>
          <li>Reference Number: ${OrderNumber}</li>
          <li>Cashapp Tag: ${tag}</li>
        </ul>
        <div>
          <p>Dear ${FullName},</p>
          
          <ul>
            <li>Order Number: ${OrderNumber}</li>
            <li>Order Date: ${OrderDate}</li>
            <li>Total Amount: ${TotalAmount}</li>
          </ul>
          <ul>
            
          </ul>
          <p>
            Best regards,
            <br/>
            The [Your App Name] Team
          </p>
          <p>
            P.S. Follow us on [social media links] for updates and exclusive offers!
          </p>
        </div>
      </div>`;

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
        subject: '' ,
        html: messageTemplate,
        text: `Hello ${FullName}`
      }
    
      try {
        trasporter.sendMail(mailOptions)
        console.log('Email sent successfully');
    
      } catch (error) {
        console.log('Email couldnt send unfortunately', error);
      }
    
};




module.exports = { sendUserOtp, signUpMssg, orderPendingMssg, finalOrderStatusMssg }