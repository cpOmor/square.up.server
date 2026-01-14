/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import config from '../config';
import { TEmailInfo } from './utils.interface';

const sendEmail = async (emailData: TEmailInfo): Promise<boolean> => {

  const transporter = nodemailer.createTransport({
    host: config.email_host as string,
    port: Number(config.email_port) as number,
    
    secure: false,
    auth: {
      user: config.email_user,
      pass: config.email_password,
    },
   
  });

  try {
    await transporter.sendMail({
      from: config.email_user,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.body,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export default sendEmail;
