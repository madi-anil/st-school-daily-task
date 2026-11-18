import { getPasswordStrength } from "./validate";

export default function StepAccount({ data, onChange, onBlur, errors }) {
  const strength = getPasswordStrength(data.password);

  return (
    <div>
      <h3>Account Details</h3>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          onBlur={onBlur}
        />
        {errors.email && <p role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={data.password}
          onChange={onChange}
          onBlur={onBlur}
        />
        {data.password && (
          <p>
            Strength: <strong>{strength.label}</strong> ({strength.score}/4)
          </p>
        )}
        {errors.password && <p role="alert">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={data.confirmPassword}
          onChange={onChange}
          onBlur={onBlur}
        />
        {errors.confirmPassword && <p role="alert">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
}