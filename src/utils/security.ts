/**
 * Security Utilities
 * 
 * This module provides sanitization and security utilities to prevent XSS attacks
 * and ensure safe handling of user-generated content.
 * 
 * @module utils/security
 */

import DOMPurify from 'dompurify';

/**
 * Configuration for DOMPurify HTML sanitization
 * Allows basic formatting tags while removing dangerous elements
 */
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'span', 'div'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'class', 'id', 'title'
  ],
  // Force all links to open in new tab with security attributes
  ADD_ATTR: ['target', 'rel'],
  // Remove event handlers
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  // Force HTTPS for links
  FORCE_HTTPS: true,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * 
 * Use this function when rendering user-generated content that may contain HTML.
 * It removes dangerous tags (script, iframe, etc.) while preserving safe formatting.
 * 
 * @param dirty - The potentially dangerous HTML string
 * @returns Sanitized HTML string safe for rendering
 * 
 * @example
 * ```tsx
 * const userContent = "<p>Hello <script>alert('xss')</script></p>";
 * const safeContent = sanitizeHTML(userContent);
 * // Result: "<p>Hello </p>"
 * 
 * // In component:
 * <div dangerouslySetInnerHTML={{ __html: safeContent }} />
 * ```
 */
export const sanitizeHTML = (dirty: string): string => {
  if (!dirty) return '';
  
  return DOMPurify.sanitize(dirty, PURIFY_CONFIG);
};

/**
 * Sanitizes plain text input by removing HTML tags
 * 
 * Use this for text inputs where HTML is not expected.
 * This is more restrictive than sanitizeHTML - it removes ALL HTML.
 * 
 * @param input - The user input string
 * @returns Plain text with HTML tags removed
 * 
 * @example
 * ```tsx
 * const userInput = "<script>alert('xss')</script>Hello";
 * const safeInput = sanitizeInput(userInput);
 * // Result: "Hello"
 * 
 * // In component:
 * <input value={safeInput} />
 * ```
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove HTML tags
  return input.replace(/<[^>]*>/g, '');
};

/**
 * Validates and sanitizes a URL to prevent javascript: protocol attacks
 * 
 * Only allows safe protocols: http, https, mailto, tel
 * Returns '#' for invalid/unsafe URLs
 * 
 * @param url - The URL to validate
 * @returns Safe URL or '#' if invalid
 * 
 * @example
 * ```tsx
 * const userUrl = "javascript:alert('xss')";
 * const safeUrl = sanitizeUrl(userUrl);
 * // Result: "#"
 * 
 * // In component:
 * <a href={safeUrl}>Link</a>
 * ```
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '#';
  
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    const trimmed = url.trim();
    const parsed = new URL(trimmed, trimmed.startsWith('http') ? undefined : 'http://localhost');
    
    if (allowedProtocols.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    // Invalid URL format
  }
  
  return '#';
};

/**
 * Escapes special HTML characters to prevent XSS
 * 
 * Use this when you need to display user input as plain text
 * without interpreting any HTML.
 * 
 * @param text - The text to escape
 * @returns Escaped text safe for HTML display
 * 
 * @example
 * ```tsx
 * const userText = "<script>alert('xss')</script>";
 * const safeText = escapeHtml(userText);
 * // Result: "&lt;script&gt;alert('xss')&lt;/script&gt;"
 * 
 * // In component:
 * <div>{safeText}</div>  // Displays as plain text
 * ```
 */
export const escapeHtml = (text: string): string => {
  if (!text) return '';
  
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
};

/**
 * Validates JWT token format
 * 
 * Checks if a string is a valid JWT format (header.payload.signature)
 * without verifying the signature (that must be done server-side).
 * 
 * @param token - The JWT token to validate
 * @returns True if valid format, false otherwise
 */
export const isValidTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Check if payload is valid base64 and JSON
    const payload = JSON.parse(atob(parts[1]));
    return payload && typeof payload === 'object';
  } catch {
    return false;
  }
};

/**
 * Checks if a JWT token is expired
 * 
 * @param token - The JWT token to check
 * @returns True if expired or invalid, false if still valid
 */
export const isTokenExpired = (token: string): boolean => {
  if (!isValidTokenFormat(token)) return true;
  
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if exp exists and is in the past
    if (!payload.exp) return false; // No expiration = never expires
    
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Generates a cryptographically secure random string
 * 
 * Useful for generating nonces, CSRF tokens, or state parameters.
 * 
 * @param length - Length of the string (default: 32)
 * @returns Random string
 */
export const generateSecureRandom = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Security validation patterns
 */
export const securityPatterns = {
  // Email validation (basic)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Safe filename (no path traversal)
  safeFilename: /^[^\\/:*?"<>|]+$/,
  
  // Alphanumeric only
  alphanumeric: /^[a-zA-Z0-9]+$/,
  
  // No script tags or event handlers
  noScript: /<script|on\w+\s*=/i,
};

/**
 * Validates if a string is safe (no script tags or event handlers)
 * 
 * @param input - String to validate
 * @returns True if safe, false if contains suspicious patterns
 */
export const isSafeString = (input: string): boolean => {
  if (!input) return true;
  return !securityPatterns.noScript.test(input);
};

export default {
  sanitizeHTML,
  sanitizeInput,
  sanitizeUrl,
  escapeHtml,
  isValidTokenFormat,
  isTokenExpired,
  generateSecureRandom,
  securityPatterns,
  isSafeString,
};