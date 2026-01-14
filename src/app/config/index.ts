import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_user: process.env.EMAIL_USER,
  email_password: process.env.EMAIL_PASSWORD,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  n8n_webhook_url: process.env.N8N_WEBHOOK_URL,
  gemini_api_url: process.env.GEMINI_API_URL,
  gemini_api_key: process.env.GEMINI_API_KEY,
  fraudlabs_api_key: process.env.FRAUDLABS_API_KEY,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
};

export const jwt_access_expires_in = process.env.JWT_ACCESS_EXPIRES_IN;
export const jwt_refresh_expires_in = process.env.JWT_REFRESH_EXPIRES_IN;
