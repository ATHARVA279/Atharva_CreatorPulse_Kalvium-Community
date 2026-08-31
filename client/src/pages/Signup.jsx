import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { login, signup } from "../services/api";

function persistSession(user, emailFallback) {
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userName", user.full_name || "Account");
  localStorage.setItem("userEmail", user.email || emailFallback);
}

const Signup = () => {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your work email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (isSignup && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = isSignup
        ? await signup(email, password, fullName)
        : await login(email, password);

      persistSession(response.user, email);
      navigate("/overview");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[374px] rounded-[10px] border border-[#CBD2DF] bg-white px-[27px] py-[28px]">
        <div className="text-center mb-7">
          <h1 className="text-[22px] font-bold leading-tight text-[#0756D9]">
            CreatorPulse
          </h1>

          <p className="mt-1 text-[13px] leading-5 text-[#4B4F59]">
            {isSignup
              ? "Create your analytics dashboard account"
              : "Sign in to your analytics dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-[14px]">
              <label
                htmlFor="fullName"
                className="block mb-[6px] text-[11px] font-medium text-[#18202D]"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                className="h-[39px] w-full rounded-[6px] border border-[#C7CEDA] bg-white px-3 text-[12px] text-gray-800 outline-none placeholder:text-[#7B8291] focus:border-[#2864DF] focus:ring-2 focus:ring-[#2864DF]/10"
              />
            </div>
          )}

          <div className="mb-[14px]">
            <label
              htmlFor="email"
              className="block mb-[6px] text-[11px] font-medium text-[#18202D]"
            >
              Work Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              className="h-[39px] w-full rounded-[6px] border border-[#C7CEDA] bg-white px-3 text-[12px] text-gray-800 outline-none placeholder:text-[#7B8291] focus:border-[#2864DF] focus:ring-2 focus:ring-[#2864DF]/10"
            />
          </div>

          <div className="mb-[14px]">
            <label
              htmlFor="password"
              className="mb-[6px] block text-[11px] font-medium text-[#18202D]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="h-[39px] w-full rounded-[6px] border border-[#C7CEDA] bg-white px-3 text-[12px] text-gray-800 outline-none placeholder:text-[#7B8291] focus:border-[#2864DF] focus:ring-2 focus:ring-[#2864DF]/10"
            />
          </div>

          {error && (
            <p className="mb-3 text-[11px] text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[35px] w-full rounded-[6px] bg-[#2864DF] text-[11px] font-medium text-white transition hover:bg-[#1F56C5] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? isSignup
                ? "Creating account..."
                : "Signing In..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div className="mt-[29px] flex items-center justify-center gap-[3px] text-[11px]">
          <span className="text-[#4D5360]">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </span>

          <Link
            to={isSignup ? "/login" : "/signup"}
            className="text-[#0756D9] hover:underline"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
