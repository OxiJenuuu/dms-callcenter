"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginForm(){
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e){
        e.preventDefault();
        setError("")
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
                callbackUrl: '/dashboard'
            });

            if (result?.error) return setError("Email sau parola gresita");
            if (result?.ok) return router.replace("/dashboard");

        } catch {
            setError("Eroare la server. Te rugam sa incerci mai tarziu. Daca eroarea persista contacteaza un admin.");
        } finally {
            setLoading(false)
        }
    }

  return(
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {error && <p className="text-error text-sm">{error}</p>}
          <input
              className={`input focus:outline-none bg-base-300 focus:ring-0 ${error ? "input-error" : "validator"}`}
              type="email"
              placeholder="example@dms.ro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <input
              className={`input focus:outline-none bg-base-300 focus:ring-0 ${error ? "input-error" : "validator"}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />

          <button
              className={loading ? "btn btn-md rig-1 outline-1 rounded-md skeleton" : "btn bg-base-300"}
              type="submit"
              disabled={loading}
          >
              Intra in cont
          </button>

      </form>
  )

}
