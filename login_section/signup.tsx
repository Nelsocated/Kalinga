"use client";

import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="container">
      <div className="card signup">

        <div className="left">
          <div className="logo-circle"></div>
          <h2>Kalinga</h2>
        </div>

        <div className="right">
          <h3>Create Account</h3>
          <p>Get started on Kalinga!</p>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <button onClick={handleSignup}>Submit</button>
        </div>
      </div>
    </div>
  );
}
