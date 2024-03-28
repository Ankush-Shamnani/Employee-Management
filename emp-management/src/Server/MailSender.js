const nodemailer = require("nodemailer");
const { format } = require("date-fns"); 

function formatDate(dateString) {
  return format(new Date(dateString), "dd-MM-yyyy");
}


const transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com", 
  port: 2525, 
  secure: false,
  auth: {
    user: "anku.shamnani@gmail.com", // SMTP username
    pass: "96F6D0868675C8E4A5CD82FA9662C5DCD853" // SMTP password
  }
});


const sendCredentials = (empData,password)=>{
const credentialMail = {
  from: "anku.shamnani@gmail.com", 
  to: `${empData.email}`, 
  subject: "Login Credentials",
  html: `<p>Hello ${empData.firstName},</p>
  <p>Your account has been created successfully. Here are your login credentials:</p>
  <p>Username: ${empData.email}</p>
  <p>Password: ${password}</p>
  <p>Please login with these credentials.</p>
  <p>Thank you!</p>` 
};

transporter.sendMail(credentialMail, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Credentials sent successfully by Email:", info.response);
  }
});
}

const sendStatus = (reqData)=>{
  const statusUpdate = {
    from: "anku.shamnani@gmail.com", 
    to: `${reqData.email}`, 
    subject: `Leave Request Update ${reqData.status}`, 
    html: `<p>Hello ${reqData.firstName},</p>
        <p>Your leave request from ${formatDate(reqData.leaveFrom)} to ${formatDate(reqData.leaveTill)} has been <b>${reqData.status}<b>.</p>
        <p>Thank you!</p>` 
  };
  
  transporter.sendMail(statusUpdate, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully for request status:", info.response);
    }
  });
  }
  
module.exports = {sendCredentials,sendStatus};