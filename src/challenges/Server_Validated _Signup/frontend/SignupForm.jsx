import { useState } from 'react';
import './SignupForm.css';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/register`;

export default function SignupForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [createdUser, setCreatedUser] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setCreatedUser(null);

        const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            age: form.age === '' ? null : Number(form.age),
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.status === 201) {
                setCreatedUser({ ...data, name: form.name.trim() });
                setForm({ name: '', email: '', password: '', age: '' });
            } else if (data.errors) {
                setErrors(data.errors);
            }
        } catch {
            setErrors({ general: 'Cannot connect to backend server.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="signup-card">
            <h2>Create Account</h2>

            {createdUser && (
                <div className="signup-success">
                    Account created! Welcome, <strong>{createdUser.name}</strong>.
                </div>
            )}

            {errors.general && <div className="signup-alert">{errors.general}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <div className="signup-field">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Bullo Rocky"
                    />
                    {errors.name && <span className="signup-error">{errors.name}</span>}
                </div>

                <div className="signup-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Bullo@example.com"
                    />
                    {errors.email && <span className="signup-error">{errors.email}</span>}
                </div>

                <div className="signup-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="signup-error">{errors.password}</span>}
                </div>

                <div className="signup-field">
                    <label htmlFor="age">Age</label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        step="1"
                        value={form.age}
                        onChange={handleChange}
                    />
                    {errors.age && <span className="signup-error">{errors.age}</span>}
                </div>

                <button type="submit" className="signup-btn" disabled={submitting}>
                    {submitting ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}