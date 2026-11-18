import { useState } from "react";
import { validate } from "./validate";
import StepAccount from "./StepAccount";
import StepProfile from "./StepProfile";
import StepReview from "./StepReview";

const INITIAL_DATA = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phone: "",
  city: "",
};

export default function SignupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Requirement 2: Single handleChange using computed property names
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Stretch goal: Validate only the blurred field without prematurely flagging untouched fields
  const handleBlur = (e) => {
    const { name } = e.target;
    const stepErrors = validate(step, formData);
    setErrors((prev) => {
      const updated = { ...prev };
      if (stepErrors[name]) {
        updated[name] = stepErrors[name];
      } else {
        delete updated[name];
      }
      return updated;
    });
  };

  // Requirement 4: Run validation and block progress if errors exist
  const handleNext = () => {
    const stepErrors = validate(step, formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const handleEditStep = (targetStep) => {
    setErrors({});
    setStep(targetStep);
  };

  // Requirement 6: Log final object and render success screen without reload
  const handleSubmit = (e) => {
    e.preventDefault();
    const step1Errors = validate(1, formData);
    const step2Errors = validate(2, formData);
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      setStep(1);
      return;
    }
    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      setStep(2);
      return;
    }

    console.log("Final Signup Submission:", formData);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setErrors({});
    setStep(1);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div>
        <h2>Signup Complete!</h2>
        <p>Welcome, {formData.fullName}. Your account has been created.</p>
        <button type="button" onClick={handleReset}>
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Multi-Step Signup</h2>
      <p>Step {step} of 3</p>

      <form onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <StepAccount
            data={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
          />
        )}

        {step === 2 && (
          <StepProfile
            data={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
          />
        )}

        {step === 3 && (
          <StepReview data={formData} onEditStep={handleEditStep} />
        )}

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          {step > 1 && (
            <button type="button" onClick={handleBack}>
              Back
            </button>
          )}

          {step < 3 && (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          )}

          {step === 3 && <button type="submit">Submit</button>}
        </div>
      </form>
    </div>
  );
}