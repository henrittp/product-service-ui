// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      navigate('/products');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="">
      {/* Título e Versão */}
      <div className="mb-6">
        <span className="text-5xl">Product Service</span>
        <span className="text-1xl"> v1.0</span>
      </div>

      {/* Título Principal */}
      <h1 className="text-5xl">Teste</h1>

      {/* Mensagem de Erro (Opcional) */}
      {error && (
        <div className="mb-4 text-red-600">
          {error}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-64">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
          required
        />
        <button
          type="submit"
          className="border p-2 font-medium"
        >
          Entrar
        </button>
      </form>

      {/* Link Esqueceu a senha */}
      <button className="mt-6 text-sm underline">
        Esqueceu a senha?
      </button>
    </div>
  );
}

export default Login;