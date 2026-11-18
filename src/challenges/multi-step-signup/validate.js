export function validate(step, data) {
  const errors = {};

  if (step === 1) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = "Invalid email";
    }

    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  if (step === 2) {
    if (!data.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    const phoneRegex = /^\d{10}$/;
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(data.phone.trim())) {
      errors.phone = "Phone must be exactly 10 digits";
    }

    if (!data.city) {
      errors.city = "Please select a city";
    }
  }

  return errors;
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}