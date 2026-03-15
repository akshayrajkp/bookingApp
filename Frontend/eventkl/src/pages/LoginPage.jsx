import { useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

// ─── tiny helpers ────────────────────────────────────────────────────────────

function validate(fields, mode) {
    const errs = {};
    if (mode === 'register') {
        if (!fields.firstName.trim()) errs.firstName = 'Required';
        if (!fields.lastName.trim())  errs.lastName  = 'Required';
    }
    if (!fields.email.trim())                        errs.email    = 'Required';
    else if (!/\S+@\S+\.\S+/.test(fields.email))     errs.email    = 'Enter a valid email';
    if (!fields.password)                             errs.password = 'Required';
    else if (fields.password.length < 6)              errs.password = 'At least 6 characters';
    if (mode === 'register' && fields.password !== fields.confirm)
        errs.confirm = 'Passwords do not match';
    return errs;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function Field({ label, id, type = 'text', value, onChange, error, placeholder, autoComplete }) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    return (
        <div className="lf-group">
            <label className="lf-label" htmlFor={id}>{label}</label>
            <div className="lf-input-wrap">
                <input
                    id={id}
                    className={`lf-input${error ? ' error' : ''}`}
                    type={isPassword ? (show ? 'text' : 'password') : type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                />
                {isPassword && (
                    <button className="lf-eye" type="button" onClick={() => setShow(s => !s)}>
                        {show ? '🙈' : '👁'}
                    </button>
                )}
            </div>
            {error && <span className="lf-error-msg">{error}</span>}
        </div>
    );
}

function SocialButtons() {
    return (
        <>
            <div className="lf-divider">
                <div className="lf-divider-line" />
                <span className="lf-divider-text">or continue with</span>
                <div className="lf-divider-line" />
            </div>
            <div className="lf-social-row">
                <button className="lf-social-btn" type="button">
                    <span className="lf-social-icon">G</span> Google
                </button>
                <button className="lf-social-btn" type="button">
                    <span className="lf-social-icon">f</span> Facebook
                </button>
            </div>
        </>
    );
}

// ─── LOGIN FORM ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess, onSwitch }) {
    const { login } = useAuth();
    const [fields, setFields] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const set = key => val => setFields(f => ({ ...f, [key]: val }));

    const handleSubmit = async e => {
        e.preventDefault();
        const errs = validate(fields, 'login');
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setApiError('');
        setLoading(true);
        try {
            await login(fields.email, fields.password);
            onSuccess();
        } catch (err) {
            setApiError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit} noValidate>
            <Field
                label="Email address"
                id="login-email"
                type="email"
                value={fields.email}
                onChange={set('email')}
                error={errors.email}
                placeholder="arjun@email.com"
                autoComplete="email"
            />
            <Field
                label="Password"
                id="login-password"
                type="password"
                value={fields.password}
                onChange={set('password')}
                error={errors.password}
                placeholder="Your password"
                autoComplete="current-password"
            />
            <div className="lf-row">
                <button className="lf-forgot" type="button">Forgot password?</button>
            </div>

            {apiError && (
                <div style={{ fontSize: 13, color: '#c0392b', marginBottom: 16, lineHeight: 1.5 }}>
                    {apiError}
                </div>
            )}

            <button className="lf-submit" type="submit" disabled={loading}>
                {loading && <span className="lf-spinner" />}
                {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <SocialButtons />

            <p className="lf-terms">
                Don't have an account?{' '}
                <span onClick={onSwitch}>Create one — it's free</span>
            </p>
        </form>
    );
}

// ─── REGISTER FORM ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess, onSwitch }) {
    const [fields, setFields] = useState({
        firstName: '', lastName: '', email: '', password: '', confirm: '',
    });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [done, setDone]       = useState(false);

    const set = key => val => setFields(f => ({ ...f, [key]: val }));

    const handleSubmit = async e => {
        e.preventDefault();
        const errs = validate(fields, 'register');
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setApiError('');
        setLoading(true);
        try {
            await registerApi({
                firstName: fields.firstName,
                lastName:  fields.lastName,
                email:     fields.email,
                password:  fields.password,
            });
            setDone(true);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="lf-success">
                <div className="lf-success-icon">✓</div>
                <div className="lf-success-title">Account created.</div>
                <p className="lf-success-sub">
                    Welcome to EventKL, {fields.firstName}! You can now sign in and start booking events.
                </p>
                <button className="lf-submit" style={{ marginTop: 8 }} onClick={onSwitch}>
                    Go to Sign in →
                </button>
            </div>
        );
    }

    return (
        <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="lf-name-row">
                <Field
                    label="First name"
                    id="reg-first"
                    value={fields.firstName}
                    onChange={set('firstName')}
                    error={errors.firstName}
                    placeholder="Arjun"
                    autoComplete="given-name"
                />
                <Field
                    label="Last name"
                    id="reg-last"
                    value={fields.lastName}
                    onChange={set('lastName')}
                    error={errors.lastName}
                    placeholder="Kumar"
                    autoComplete="family-name"
                />
            </div>
            <Field
                label="Email address"
                id="reg-email"
                type="email"
                value={fields.email}
                onChange={set('email')}
                error={errors.email}
                placeholder="arjun@email.com"
                autoComplete="email"
            />
            <Field
                label="Password"
                id="reg-password"
                type="password"
                value={fields.password}
                onChange={set('password')}
                error={errors.password}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
            />
            <Field
                label="Confirm password"
                id="reg-confirm"
                type="password"
                value={fields.confirm}
                onChange={set('confirm')}
                error={errors.confirm}
                placeholder="Repeat password"
                autoComplete="new-password"
            />

            {apiError && (
                <div style={{ fontSize: 13, color: '#c0392b', marginBottom: 16, lineHeight: 1.5 }}>
                    {apiError}
                </div>
            )}

            <button className="lf-submit" type="submit" disabled={loading}>
                {loading && <span className="lf-spinner" />}
                {loading ? 'Creating account…' : 'Create account'}
            </button>

            <SocialButtons />

            <p className="lf-terms">
                By registering you agree to our{' '}
                <span>Terms of Service</span> and <span>Privacy Policy</span>.
                Already have an account?{' '}
                <span onClick={onSwitch}>Sign in</span>
            </p>
        </form>
    );
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function LoginPage({ onNav }) {
    const [tab, setTab] = useState('login'); // 'login' | 'register'

    const switchTab = t => setTab(t);
    const onSuccess = () => onNav('home');

    return (
        <div className="login-page">

            {/* ── LEFT — brand panel ── */}
            <div className="login-left">
                <div className="ll-hatch" />
                <div className="ll-blob-1" />
                <div className="ll-blob-2" />
                <div className="ll-dots" />

                <div className="login-left-logo" onClick={() => onNav('home')}>EventKL</div>

                <div className="login-left-body">
                    <div className="login-left-eyebrow">Kerala's event platform</div>
                    <h2 className="login-left-h">
                        Every great<br /><em>evening</em><br />starts here.
                    </h2>
                    <p className="login-left-p">
                        Discover, book and attend the best cultural events across Kerala.
                        Your next unforgettable night is one click away.
                    </p>
                </div>

                <div className="login-left-footer">
                    <div className="ll-stat">
                        <div className="ll-stat-val">200+</div>
                        <div className="ll-stat-label">Events</div>
                    </div>
                    <div className="ll-stat">
                        <div className="ll-stat-val">12k+</div>
                        <div className="ll-stat-label">Members</div>
                    </div>
                    <div className="ll-stat">
                        <div className="ll-stat-val">40+</div>
                        <div className="ll-stat-label">Venues</div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT — form panel ── */}
            <div className="login-right">
                <div className="login-right-top">
                    <div className="login-right-greeting">
                        {tab === 'login'
                            ? <>New here? <span onClick={() => switchTab('register')}>Create an account</span></>
                            : <>Already a member? <span onClick={() => switchTab('login')}>Sign in</span></>
                        }
                    </div>
                </div>

                {/* Tab switcher */}
                <div className="login-tabs">
                    <button
                        className={`login-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => switchTab('login')}
                    >
                        Sign in
                    </button>
                    <button
                        className={`login-tab ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => switchTab('register')}
                    >
                        Create account
                    </button>
                </div>

                {/* Heading */}
                {tab === 'login' ? (
                    <>
                        <h1 className="login-h2">Welcome <em>back.</em></h1>
                        <p className="login-sub">Sign in to access your tickets and discover events.</p>
                    </>
                ) : (
                    <>
                        <h1 className="login-h2">Join <em>EventKL.</em></h1>
                        <p className="login-sub">Create your free account and start booking in seconds.</p>
                    </>
                )}

                {/* Forms */}
                {tab === 'login'
                    ? <LoginForm    onSuccess={onSuccess} onSwitch={() => switchTab('register')} />
                    : <RegisterForm onSuccess={onSuccess} onSwitch={() => switchTab('login')}    />
                }
            </div>

        </div>
    );
}