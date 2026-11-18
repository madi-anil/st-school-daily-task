const CITIES = ["Hyderabad", "Bengaluru", "Guwahati", "Mumbai", "Delhi", "Chennai"];

export default function StepProfile({ data, onChange, onBlur, errors }) {
  return (
    <div>
      <h3>Profile Details</h3>

      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={data.fullName}
          onChange={onChange}
          onBlur={onBlur}
        />
        {errors.fullName && <p role="alert">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="phone">Phone (10 digits)</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          maxLength={10}
          value={data.phone}
          onChange={onChange}
          onBlur={onBlur}
        />
        {errors.phone && <p role="alert">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="city">City</label>
        <select
          id="city"
          name="city"
          value={data.city}
          onChange={onChange}
          onBlur={onBlur}
        >
          <option value="">-- Select City --</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && <p role="alert">{errors.city}</p>}
      </div>
    </div>
  );
}