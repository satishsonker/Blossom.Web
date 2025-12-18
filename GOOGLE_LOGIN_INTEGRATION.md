# Google Login Integration Guide

This guide provides step-by-step instructions for integrating Google Sign-In with the Blossom application.

## Prerequisites

- Google Cloud Platform (GCP) account
- Access to Google Cloud Console
- Backend API endpoint ready to handle Google authentication tokens

## Step-by-Step Integration

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Blossom App")
5. Click **"Create"**

### Step 2: Enable Google+ API

1. In the Google Cloud Console, navigate to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** or **"Identity Toolkit API"**
3. Click on it and click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: Blossom
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Save and Continue"** (default scopes are sufficient)
7. On the **Test users** page, add test email addresses if needed
8. Click **"Save and Continue"**
9. Review and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Select application type: **"Web application"**
4. Enter a name (e.g., "Blossom Web Client")
5. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `http://localhost:8080` (if using different port)
   - Your production domain (e.g., `https://yourdomain.com`)
6. Add **Authorized redirect URIs**:
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
7. Click **"Create"**
8. **IMPORTANT**: Copy the **Client ID** - you'll need this for the frontend

### Step 5: Configure Frontend Environment Variables

1. Create or update your `.env` file in the project root:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

2. **Important**: Make sure `.env` is in your `.gitignore` file to avoid committing credentials

### Step 6: Backend API Setup

Your backend needs to handle Google authentication. Here's what the backend endpoint should do:

#### Endpoint: `POST /auth/google`

**Request Body:**
```json
{
  "token": "google-credential-token"
}
```

**Backend Implementation Steps:**

1. **Verify the Google Token:**
   - Use Google's token verification library for your backend language
   - Verify the token with Google's servers
   - Extract user information from the token

2. **Example Node.js/Express Implementation:**
   ```javascript
   const { OAuth2Client } = require('google-auth-library');
   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

   app.post('/auth/google', async (req, res) => {
     try {
       const { token } = req.body;
       
       // Verify the token
       const ticket = await client.verifyIdToken({
         idToken: token,
         audience: process.env.GOOGLE_CLIENT_ID,
       });
       
       const payload = ticket.getPayload();
       const { sub, email, name, picture } = payload;
       
       // Check if user exists in your database
       let user = await User.findOne({ email });
       
       if (!user) {
         // Create new user
         user = await User.create({
           email,
           name,
           googleId: sub,
           avatar: picture,
           role: 'user',
         });
       } else {
         // Update existing user with Google ID if not set
         if (!user.googleId) {
           user.googleId = sub;
           await user.save();
         }
       }
       
       // Generate JWT token for your app
       const jwtToken = generateJWTToken(user);
       
       res.json({
         success: true,
         data: {
           token: jwtToken,
           user: {
             id: user.id,
             email: user.email,
             name: user.name,
             role: user.role,
           },
         },
       });
     } catch (error) {
       res.status(401).json({
         success: false,
         message: 'Invalid Google token',
       });
     }
   });
   ```

3. **Example Python/Django Implementation:**
   ```python
   from google.oauth2 import id_token
   from google.auth.transport import requests
   
   @api_view(['POST'])
   def google_login(request):
       token = request.data.get('token')
       
       try:
           # Verify the token
           idinfo = id_token.verify_oauth2_token(
               token, 
               requests.Request(), 
               settings.GOOGLE_CLIENT_ID
           )
           
           email = idinfo['email']
           name = idinfo['name']
           google_id = idinfo['sub']
           
           # Check if user exists
           user = User.objects.filter(email=email).first()
           
           if not user:
               user = User.objects.create(
                   email=email,
                   name=name,
                   google_id=google_id,
                   role='user'
               )
           else:
               if not user.google_id:
                   user.google_id = google_id
                   user.save()
           
           # Generate JWT token
           jwt_token = generate_jwt_token(user)
           
           return Response({
               'success': True,
               'data': {
                   'token': jwt_token,
                   'user': {
                       'id': user.id,
                       'email': user.email,
                       'name': user.name,
                       'role': user.role,
                   }
               }
           })
       except ValueError:
           return Response({
               'success': False,
               'message': 'Invalid Google token'
           }, status=401)
   ```

### Step 7: Database Schema Updates

Add Google ID field to your users table:

**SQL Migration:**
```sql
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
```

**Mongoose Schema:**
```javascript
{
  googleId: { type: String, unique: true, sparse: true },
  avatar: String,
  // ... other fields
}
```

### Step 8: Testing

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Test Google Login:**
   - Click on "Continue with Google" button
   - You should see Google's sign-in popup
   - Select a Google account
   - Verify that the user is logged in

3. **Test with Test Users:**
   - If your app is in testing mode, only test users can sign in
   - Add test users in OAuth consent screen settings

### Step 9: Production Deployment

1. **Update OAuth Credentials:**
   - Add your production domain to authorized origins
   - Add production redirect URIs

2. **Update Environment Variables:**
   - Set `REACT_APP_GOOGLE_CLIENT_ID` in your production environment
   - Ensure backend has the same `GOOGLE_CLIENT_ID` configured

3. **Publish Your App:**
   - If using external OAuth consent screen, you'll need to publish it
   - Go to OAuth consent screen > Publish App
   - This may require verification for sensitive scopes

### Step 10: Security Considerations

1. **Always verify tokens on the backend** - Never trust client-side tokens
2. **Use HTTPS in production** - Google requires HTTPS for production
3. **Store Client ID securely** - Use environment variables
4. **Validate user data** - Sanitize and validate all user input
5. **Handle errors gracefully** - Show user-friendly error messages

## Troubleshooting

### Issue: "Invalid client" error
- **Solution**: Check that your Client ID matches in both frontend and backend

### Issue: "Redirect URI mismatch"
- **Solution**: Ensure the redirect URI in Google Console matches your app URL exactly

### Issue: Google Sign-In button not appearing
- **Solution**: 
  - Check browser console for errors
  - Verify Google script is loaded: `https://accounts.google.com/gsi/client`
  - Check that `REACT_APP_GOOGLE_CLIENT_ID` is set correctly

### Issue: Token verification fails on backend
- **Solution**: 
  - Ensure backend is using the same Client ID
  - Check that Google Auth library is properly installed
  - Verify token is being sent correctly from frontend

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the network tab for API call failures
3. Verify all environment variables are set correctly
4. Ensure backend API is properly configured

---

**Note**: This integration uses Google Identity Services (new) instead of the deprecated Google Sign-In JavaScript library. The implementation is future-proof and follows Google's latest recommendations.

