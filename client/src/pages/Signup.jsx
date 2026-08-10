import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Please enter your work email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // TODO: Connect this to your backend
      //
      // const response = await fetch(
      //   "http://localhost:5000/api/auth/login",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       email,
      //       password,
      //     }),
      //   }
      // );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Login:", {
        email,
        password,
      });

      // On successful login:
      // navigate("/dashboard");

    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
    
    // Later:
    // window.location.href =
    //   "http://localhost:5000/api/auth/google";
  };

  const handleMicrosoftLogin = () => {
    console.log("Microsoft login");

    // Later:
    // window.location.href =
    //   "http://localhost:5000/api/auth/microsoft";
  };

  const handleForgotPassword = () => {
    console.log("Forgot password");

    // Later:
    // navigate("/forgot-password");
  };

  const handleRequestDemo = () => {
    console.log("Request demo");

    // Later:
    // navigate("/request-demo");
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      
      {/* Login Card */}
      <div className="w-full max-w-[374px] rounded-[10px] border border-[#CBD2DF] bg-white px-[27px] py-[28px]">
        
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-[22px] font-bold leading-tight text-[#0756D9]">
            InfluencIQ
          </h1>

          <p className="mt-1 text-[13px] leading-5 text-[#4B4F59]">
            Sign in to your analytics dashboard
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-[10px]">

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="h-[37px] w-full rounded-[6px] border border-[#C9D0DC] bg-white text-[12px] text-[#111827] flex items-center justify-center gap-[9px] transition hover:bg-gray-50 hover:border-gray-400"
          >
            {/* Cloud Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 19H8C5.23858 19 3 16.7614 3 14C3 11.5109 4.81982 9.44705 7.20351 9.05942C7.69095 6.73082 9.74338 5 12.2 5C15.0275 5 17.32 7.28713 17.3268 10.1121C19.9821 10.2021 22 12.3609 22 15C22 17.7614 19.7614 19 17.5 19Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>Sign in with Google</span>
          </button>

          {/* Microsoft */}
          <button
            type="button"
            onClick={handleMicrosoftLogin}
            className="h-[37px] w-full rounded-[6px] border border-[#C9D0DC] bg-white text-[12px] text-[#111827] flex items-center justify-center gap-[9px] transition hover:bg-gray-50 hover:border-gray-400"
          >
            {/* Briefcase Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="7"
                width="18"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M3 12H21"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>

            <span>Sign in with Microsoft</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-[13px] my-6">
          <div className="h-px flex-1 bg-[#D9DEE7]" />

          <p className="whitespace-nowrap text-[11px] text-[#454B57]">
            or continue with email
          </p>

          <div className="h-px flex-1 bg-[#D9DEE7]" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
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

          {/* Password */}
          <div className="mb-[14px]">

            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="mb-[6px] block text-[11px] font-medium text-[#18202D]"
              >
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="mb-[6px] text-[11px] text-[#0756D9] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-[39px] w-full rounded-[6px] border border-[#C7CEDA] bg-white px-3 text-[12px] text-gray-800 outline-none placeholder:text-[#7B8291] focus:border-[#2864DF] focus:ring-2 focus:ring-[#2864DF]/10"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mb-3 text-[11px] text-red-600">
              {error}
            </p>
          )}

          {/* Sign In */}
          <button
            type="submit"
            disabled={loading}
            className="h-[35px] w-full rounded-[6px] bg-[#2864DF] text-[11px] font-medium text-white transition hover:bg-[#1F56C5] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Request Demo */}
        <div className="mt-[29px] flex items-center justify-center gap-[3px] text-[11px]">
          <span className="text-[#4D5360]">
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={handleRequestDemo}
            className="text-[#0756D9] hover:underline"
          >
            Request Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;