# Technical Documentation

## ReactJS Lab - Security Implementation

This document provides detailed technical information about the security implementation in the ReactJS Lab boilerplate.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Content Security Policy (CSP)](#content-security-policy-csp)
3. [XSS Prevention](#xss-prevention)
4. [Authentication Flow](#authentication-flow)
5. [Security Headers](#security-headers)
6. [Input Validation](#input-validation)
7. [Testing Security](#testing-security)
8. [Production Deployment](#production-deployment)

---

## Architecture Overview

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Content Security Policy (CSP)                    │
│  ├── Blocks unauthorized resource loading                  │
│  ├── Prevents inline script injection                      │
│  └── Config: index.html + vite.config.ts                   │
│                                                             │
│  Layer 2: Security Headers                                  │
│  ├── X-Frame-Options (clickjacking)                        │
│  ├── X-Content-Type-Options (MIME sniffing)                │
│  └── Referrer-Policy                                       │
│                                                             │
│  Layer 3: XSS Prevention                                    │
│  ├── DOMPurify sanitization                                │
│  ├── Input validation                                      │
│  └── Output encoding                                       │
│                                                             │
│  Layer 4: Authentication Security                           │
│  ├── Token validation                                      │
│  ├── Token expiration checking                             │
│  └── Secure storage pattern                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Content Security Policy (CSP)

### Implementation

**File:** `index.html`
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data: https:; 
               connect-src 'self'; 
               frame-ancestors 'none'; 
               base-uri 'self'; 
               form-action 'self';">
```

**File:** `vite.config.ts`
```typescript
server: {
  headers: {
    'Content-Security-Policy': "default-src 'self'; ...",
  }
}
```

### Directive Reference

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Default policy for all resources |
| `script-src` | `'self' 'unsafe-inline'` | JavaScript sources (unsafe-inline required for React) |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | CSS sources |
| `font-src` | `'self' https://fonts.gstatic.com` | Font sources |
| `img-src` | `'self' data: https:` | Image sources |
| `connect-src` | `'self'` | API endpoints (AJAX/fetch) |
| `frame-ancestors` | `'none'` | Prevents clickjacking |
| `base-uri` | `'self'` | Restricts base tag |
| `form-action` | `'self'` | Restricts form submissions |

### Testing CSP

1. **Browser DevTools:**
   - Open Chrome DevTools
   - Go to Application tab → Frames → CSP
   - Review all directives

2. **Console Warnings:**
   - Watch for CSP violation warnings
   - Example: "Refused to load the script..."

3. **Online Testing:**
   ```bash
   # Using curl
   curl -I http://localhost:5173 | grep -i content-security
   ```

---

## XSS Prevention

### DOMPurify Configuration

**File:** `src/utils/security.ts`

```typescript
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'span', 'div'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'class', 'id', 'title'
  ],
  ADD_ATTR: ['target', 'rel'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  FORCE_HTTPS: true,
};
```

### Usage Examples

#### 1. Sanitizing HTML Content

```typescript
import { sanitizeHTML } from '@/utils/security'

// Attacker input
const userInput = "<p>Hello</p><script>alert('xss')</script>"

// After sanitization
const safeHTML = sanitizeHTML(userInput)
// Result: "<p>Hello</p>"

// In component
<div dangerouslySetInnerHTML={{ __html: safeHTML }} />
```

#### 2. Sanitizing Plain Text

```typescript
import { sanitizeInput } from '@/utils/security'

// Remove all HTML
const clean = sanitizeInput("<b>Bold</b> Text")
// Result: "Bold Text"
```

#### 3. Sanitizing URLs

```typescript
import { sanitizeUrl } from '@/utils/security'

// Prevents javascript: protocol attacks
const safeUrl = sanitizeUrl("javascript:alert('xss')")
// Result: "#"
```

#### 4. Escaping HTML

```typescript
import { escapeHtml } from '@/utils/security'

// For displaying code/text safely
const escaped = escapeHtml("<script>alert(1)</script>")
// Result: "&lt;script&gt;alert(1)&lt;/script&gt;"
```

### Security Patterns

```typescript
export const securityPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  safeFilename: /^[^\\/:*?"<>|]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noScript: /<script|on\w+\s*=/i,
}
```

---

## Authentication Flow

### Current Implementation (Demo)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Login     │────▶│   Validate   │────▶│   Store     │
│   Page      │     │   Credentials│     │   localStorage│
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                                                ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   API Call  │◀────│   Get Token  │◀────│   Request   │
│   (Axios)   │     │   from Store │     │   Token     │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Token Validation

**File:** `src/utils/security.ts`

```typescript
// Validate JWT format
export const isValidTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  
  try {
    const payload = JSON.parse(atob(parts[1]))
    return payload && typeof payload === 'object'
  } catch {
    return false
  }
}

// Check expiration
export const isTokenExpired = (token: string): boolean => {
  if (!isValidTokenFormat(token)) return true
  
  try {
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return false
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
```

### Protected Route Implementation

**File:** `src/routes/index.tsx`

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isTokenValid = authService.isTokenValid()
  
  if (!isAuthenticated || !isTokenValid) {
    if (!isTokenValid && isAuthenticated) {
      authService.clearTokens()
      useAuthStore.getState().logout()
    }
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
```

### Production Migration (httpOnly Cookies)

**Current (Demo):**
```typescript
// Store in localStorage
localStorage.setItem('token', jwtToken)

// Retrieve
const token = localStorage.getItem('token')
```

**Production (httpOnly Cookie):**
```typescript
// Backend sets cookie
Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// Frontend - nothing to do!
// Cookie sent automatically with requests
```

**Migration Steps:**
1. Remove all localStorage operations in authService
2. Uncomment `withCredentials: true` in api.ts
3. Backend handles all token storage
4. Update ProtectedRoute to check auth state only

---

## Security Headers

### Implementation

**File:** `vite.config.ts`

```typescript
server: {
  headers: {
    'Content-Security-Policy': "...",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },
}
```

### Header Reference

| Header | Value | Protection |
|--------|-------|------------|
| X-Frame-Options | DENY | Clickjacking |
| X-Content-Type-Options | nosniff | MIME sniffing |
| X-XSS-Protection | 1; mode=block | Legacy XSS |
| Referrer-Policy | strict-origin-when-cross-origin | Information leakage |
| Permissions-Policy | geolocation=()... | Feature restrictions |

---

## Input Validation

### Zod Schema Validation

**File:** `src/lib/validation.ts`

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

### Usage with React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validation'

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
})
```

---

## Testing Security

### Automated Tests

```bash
# Check for vulnerabilities
npm audit

# Check specific package
npm audit --package dompurify
```

### Manual Testing

#### 1. XSS Testing

```javascript
// In browser console, try:
const xss = "<img src=x onerror=alert('xss')>"
// Use in form inputs and check if sanitized
```

#### 2. CSP Testing

```javascript
// Try loading external script
document.write('<script src="https://evil.com/script.js"><\/script>')
// Should be blocked by CSP
```

#### 3. Authentication Testing

```javascript
// Corrupt token in localStorage
localStorage.setItem('token', 'invalid_token')
// Refresh page - should redirect to login
```

#### 4. Token Expiration Testing

```javascript
// Check token expiry
const token = localStorage.getItem('token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Expires:', new Date(payload.exp * 1000))
```

### Security Checklist

Before deployment:

- [ ] Run `npm audit`
- [ ] Test CSP in DevTools
- [ ] Verify all inputs are validated
- [ ] Check XSS sanitization
- [ ] Test authentication flow
- [ ] Verify security headers
- [ ] Review token storage (migrate to httpOnly for production)

---

## Production Deployment

### Security Checklist

| Task | Priority | Details |
|------|----------|---------|
| HTTPS | Critical | Required for secure cookies |
| httpOnly Cookies | Critical | Replace localStorage |
| CORS | Critical | Whitelist specific origins |
| Rate Limiting | High | Prevent brute force |
| CSP Nonce | Medium | For strict CSP |
| Security Headers | High | All headers enabled |
| Input Validation | Critical | Backend + frontend |
| Output Encoding | High | Always sanitize HTML |

### Migration Guide

#### Step 1: Backend Setup

```javascript
// Express.js example
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // Validate credentials
  const user = await validateCredentials(email, password)
  
  // Generate tokens
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '15m' })
  
  // Set httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  })
  
  res.json({ success: true, user })
})
```

#### Step 2: Frontend Update

```typescript
// api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Enable cookies
})

// Remove token handling from request interceptor
api.interceptors.request.use(
  (config) => {
    // No token handling needed - cookie sent automatically
    return config
  }
)
```

#### Step 3: Update ProtectedRoute

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
```

---

## Additional Resources

### Security Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| DOMPurify | XSS prevention | ^3.x |
| Zod | Schema validation | ^3.x |
| axios | HTTP client | ^1.x |

### References

- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSP Quick Reference](https://content-security-policy.com/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [JWT Security Best Practices](https://auth0.com/blog/jwt-security-best-practices/)

---

## Support

For security issues or questions:
1. Check AGENTS.md for implementation guidelines
2. Review this documentation
3. Test using provided methods
4. Consult security resources listed above

**Remember:** Client-side security is only one layer. Always implement server-side validation and security measures.
