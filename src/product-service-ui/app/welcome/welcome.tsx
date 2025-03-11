import { useState } from "react";
import logoLight from "./5087579.png";

export function Welcome() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await response.json();
      // Armazena o token JWT
      localStorage.setItem("authToken", data.token);

      // Redireciona para área restrita
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full min-h-svh bg-[#fff1de] font-[--font-apple] py-4 px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-[420px]">
        <div className="flex items-center justify-center mb-3 sm:mb-6">
          <img
            src={logoLight}
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 mr-3 object-contain"
          />

          <h1 className="text-3xl sm:text-3xl font-medium font-[--font-tiempos] text-gray-900">
            This is <span className="text-indigo-500">Conduit</span>
          </h1>
        </div>

        {/* Card com proporções Apple-like e aspect ratio melhorado */}
        <div
          className="w-[90%] sm:w-[85%] max-w-[380px] overflow-hidden bg-white/20 backdrop-blur-xl 
          rounded-2xl shadow-gray-500/40 shadow-2xl
          border border-white/20"
        >
          <div className="pt-6 sm:pt-7 pb-2 sm:pb-3 px-6 sm:px-8">
            <p className="text-ls sm:text-sm text-gray-500 font-[--font-tiempos] text-center mt-0.5 sm:mt-1">
              Put your credentials down below
            </p>
          </div>

          <div className="px-6 sm:px-8 pt-4 sm:pt-5 pb-6 sm:pb-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 sm:space-y-6 flex flex-col items-center"
            >
              {error && (
                <div className="text-red-500 text-sm w-full text-center">
                  {error}
                </div>
              )}

              <div className="relative w-full">
                <input
                  type="text"
                  name="usuario"
                  id="usuario"
                  placeholder=" "
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer w-full px-4 pt-5 pb-1 sm:pb-2 bg-white/40 border border-white/30 rounded-xl text-gray-800
                    text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/60 focus:border-transparent
                    shadow-sm"
                />
                <label
                  htmlFor="usuario"
                  className="absolute text-sm text-gray-500 left-4 
                    transition-all duration-150
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                    peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-indigo-500
                    peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs"
                >
                  Username
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="password"
                  name="senha"
                  id="senha"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full px-4 pt-5 pb-1 sm:pb-2 bg-white/40 border border-white/30 rounded-xl text-gray-800
                    text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/60 focus:border-transparent
                    shadow-sm"
                />
                <label
                  htmlFor="senha"
                  className="absolute text-sm text-gray-500 left-4 
                    transition-all duration-150
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                    peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-indigo-500
                    peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs"
                >
                  Password
                </label>
              </div>

              <div className="w-full text-right">
                <a
                  href="#"
                  className="text-xs sm:text-sm text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  Forgot it? No worries...
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-1 px-4 py-2.5 sm:py-3 ${
                  isLoading
                    ? "bg-indigo-400"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white text-sm font-medium
                  rounded-xl shadow-lg shadow-indigo-500/25
                  transform transition duration-200 hover:scale-[1.02] active:scale-[0.98]`}
              >
                {isLoading ? "Logging in..." : "Initialize"}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-gray-600">
          made late at night, but with ❤️ by Henri
        </p>
      </div>
    </main>
  );
}
