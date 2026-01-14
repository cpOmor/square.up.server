# AI Server

Complete AI Server with Authentication System including User Registration, Login, and Forgot Password functionality.

## Features

- ✅ User Registration with Email Verification
- ✅ User Login with JWT Authentication
- ✅ Forgot Password with OTP Verification
- ✅ Reset Password
- ✅ Refresh Token
- ✅ User Profile Management
- ✅ Role-based Access Control
- ✅ Email Service Integration
- ✅ Image Upload with Cloudinary
- ✅ MongoDB Integration
- ✅ TypeScript Support
- ✅ Error Handling
- ✅ Request Validation with Zod

## Tech Stack

- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email services
- **Cloudinary** for image uploads
- **Zod** for validation

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and configure environment variables (see `.env` file)

4. Run in development mode:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```


## API Endpoints

### Courier
- **DELETE** `/api/courier/clear-all` — Clear all courier data for the authenticated user
- **POST** `/api/courier/create-courier` — Create a new courier entry

### API Config
- **POST** `/api/apiconfig` — Create API key and secret key for user
- **GET** `/api/apiconfig` — Get all API configs
- **GET** `/api/apiconfig/:id` — Get single API config by ID
- **PATCH** `/api/apiconfig/:id` — Update API key/secret key
- **DELETE** `/api/apiconfig/:id` — Delete API config

### Fraud Detection
- **GET** `/api/fraud/setting` — Get fraud detection setting (enabled, threshold)
- **PATCH** `/api/fraud/setting` — Update fraud detection setting (enable/disable, threshold)
- **POST** `/api/fraud/check` — Check fraud for a given risk score (allowed/blocked)

### Custom AI Prompt
- **POST** `/api/customai/prompt` — Set or update custom AI prompt (max 50 chars)
- **GET** `/api/customai/prompt` — Get custom AI prompt
- **DELETE** `/api/customai/prompt` — Delete custom AI prompt

---

## Postman Collection

All endpoints are available in the Postman collection:

**[Download Full_API_Collection.postman_collection.json](./Full_API_Collection.postman_collection.json)**

---

## Example Request Bodies

### Create API Config
```json
{
	"apiKey": "your-api-key",
	"secretKey": "your-secret-key"
}
```

### Update Fraud Setting
```json
{
	"enabled": true,
	"threshold": 80
}
```

### Check Fraud
```json
{
	"riskScore": 85
}
```

### Set Custom AI Prompt
```json
{
	"prompt": "Your custom prompt (max 50 chars)"
}
```

## Project Structure

```
src/
├── app/
│   ├── builder/
│   │   └── QueryBuilder.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── AppError.ts
│   │   ├── handleCastError.ts
│   │   ├── handleDuplicateError.ts
│   │   ├── handleValidationError.ts
│   │   └── handleZodError.ts
│   ├── interface/
│   │   ├── error.ts
│   │   └── index.d.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── globalErrorhandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   ├── Auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.model.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.utils.ts
│   │   │   └── auth.validation.ts
│   │   └── User/
│   │       ├── user.controller.ts
│   │       ├── user.interface.ts
│   │       ├── user.model.ts
│   │       ├── user.route.ts
│   │       ├── user.service.ts
│   │       └── user.validation.ts
│   ├── routes/
│   │   └── index.ts
│   └── utils/
│       ├── catchAsync.ts
│       ├── decoded.ts
│       ├── errorfunc.ts
│       ├── generateUniqueCode.ts
│       ├── hashedPassword.ts
│       ├── sendEmail.ts
│       ├── sendImageToCloudinary.ts
│       ├── sendResponse.ts
│       ├── utils.interface.ts
│       └── utils.ts
└── server.ts
```

## Author

Omar Faruk

## License

ISC
# QuckParcelAIServer
