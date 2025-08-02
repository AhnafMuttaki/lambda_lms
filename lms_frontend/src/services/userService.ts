// User API integration for register and login
const API_URL = import.meta.env.VITE_USER_SERVICE_URL;

export async function registerUser({ name, email, password, role }: { name: string; email: string; password: string; role: string }) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
