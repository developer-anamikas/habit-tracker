const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;
const MIN_PASSWORD_LENGTH = 6;

export function validateName(name) {
  if (!name || typeof name !== "string" || !name.trim()) {
    return { valid: false, message: "Name is required" };
  }

  return { valid: true };
}

export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, message: "Email is required" };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, message: "Invalid email format" };
  }

  return { valid: true };
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { valid: true };
}
