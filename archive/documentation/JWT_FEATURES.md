# JWT Security Tools - New Features

## 🔐 JWT Validation & Decoder
**Updated from "JWT Parser"**
- **Enhanced JWT decoding** with better error handling
- **Signature verification** - Enter your secret key to verify JWT signatures
- **Security warnings** - Automatic detection of common security issues
- **Status indicators** - Visual feedback for valid/invalid tokens

### Features:
- ✅ Decode JWT tokens into Header, Payload, and Signature
- ✅ Verify JWT signatures with secret keys
- ✅ Security checks for common vulnerabilities
- ✅ Visual status indicators
- ✅ Better error handling and user feedback

## 🔑 JWT Generator & Secret Key Generator
**Brand new feature**

### Secret Key Generator:
- **Configurable key lengths**: 32, 64, 128, 256, 512 bits
- **Cryptographically secure** random generation
- **Protected display** - Keys are hidden by default for security
- **One-click copy** to clipboard
- **Auto-integration** with JWT token generator

### JWT Token Generator:
- **Multiple algorithms**: HS256, HS384, HS512
- **Custom headers and payloads** - Full JSON editing
- **Secret key integration** - Use generated secrets or provide your own
- **Real-time JWT generation** - Instant token creation
- **Copy functionality** - Easy token copying

### Features:
- ✅ Generate secure secret keys (32-512 bits)
- ✅ Create custom JWT tokens with any payload
- ✅ Support for HS256, HS384, HS512 algorithms
- ✅ Hidden secret display for security
- ✅ Automatic secret integration between tools
- ✅ Copy to clipboard functionality

## 🛡️ JWT Security Fuzzer
**Advanced security testing tool**

### Security Tests:
1. **None Algorithm Attack** - Detects use of insecure "none" algorithm
2. **Blank Signature Attack** - Checks for empty signatures
3. **Weak Secret Detection** - Tests against common weak secrets
4. **Expired Token Test** - Validates token expiration
5. **Audience Bypass Test** - Checks for audience claims
6. **Issuer Spoofing Test** - Validates issuer claims

### Features:
- ✅ Multiple vulnerability checks
- ✅ Configurable test selection
- ✅ Color-coded results (Vulnerability/Warning/Safe)
- ✅ Detailed security recommendations
- ✅ Common weakness detection
- ✅ Security best practice validation

## 🎨 Sidebar Improvements

### Visual Enhancements:
- **Modern gradient** with blue tones
- **Enhanced hover effects** with smooth animations
- **Active state indicators** with blue accent
- **Better mobile experience** with improved toggle
- **Custom scrollbar** styling
- **Micro-interactions** throughout the interface

### UX Improvements:
- **Auto-close on mobile** after menu selection
- **Smart active state** management
- **Better touch interactions**
- **Improved accessibility**

## 🚀 Getting Started

### JWT Validation:
1. Paste your JWT token in the textarea
2. Click "Decode & Validate" to parse the token
3. Optionally enter a secret key and click "Verify Signature"

### JWT Generation:
1. Choose desired secret key length and click "Generate Secret"
2. Click "Show Full Secret" to reveal the key
3. Customize the header and payload JSON
4. Select algorithm (HS256/384/512)
5. Click "Generate JWT Token"

### Security Fuzzing:
1. Paste a JWT token to test
2. Select which security tests to run
3. Click "Start Security Fuzzing"
4. Review color-coded results and recommendations

## 🔧 Technical Details

### Supported Algorithms:
- **HMAC SHA-256** (HS256)
- **HMAC SHA-384** (HS384) 
- **HMAC SHA-512** (HS512)

### Security Features:
- Cryptographically secure random number generation
- Protected secret key display
- Common vulnerability detection
- Security best practice validation
- Real signature verification

### Browser Compatibility:
- Modern browsers with Web Crypto API support
- Chrome, Firefox, Safari, Edge (latest versions)

## 📚 References
- [JWT.io](https://jwt.io/) - JWT standard reference
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JSON Web Token specification
- [JWTSecrets.com](https://jwtsecrets.com/) - Inspiration for security features
- [OWASP JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) - Security best practices
