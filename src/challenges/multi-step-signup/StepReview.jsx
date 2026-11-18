export default function StepReview({ data, onEditStep }) {
  return (
    <div>
      <h3>Review Your Details</h3>

      <section>
        <h4>
          Account{" "}
          <button type="button" onClick={() => onEditStep(1)}>
            Edit
          </button>
        </h4>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Password:</strong> {"•".repeat(data.password.length)}</p>
      </section>

      <section>
        <h4>
          Profile{" "}
          <button type="button" onClick={() => onEditStep(2)}>
            Edit
          </button>
        </h4>
        <p><strong>Full Name:</strong> {data.fullName}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
        <p><strong>City:</strong> {data.city}</p>
      </section>
    </div>
  );
}