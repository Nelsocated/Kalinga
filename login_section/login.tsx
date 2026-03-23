"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="container">
      <div className="card">

        <Link href="/about" className="about">About Us</Link>

        <div className="left">
          <div className="logo-circle"></div>
          <p>Will you help us find our fur-ever homes?</p>
        </div>

        <div className="right">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Log In</button>

          <hr />

          <Link href="/signup">
            <button className="secondary">Sign Up</button>
          </Link>

          <Link href="/shelter">
            <p className="link">Create a Page For Shelters</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
