"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        if (loading) return

        setError("")
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username,
                password,
                callbackUrl: "/dashboard",
            })

            if (result?.error) {
                setError("Username sau parola gresita")
                return
            }

            router.replace(result?.url || "/dashboard")
        } catch {
            setError("Eroare la server. Te rugam sa incerci mai tarziu.")
        } finally {
            setLoading(false)
        }
    }

    const onPasswordKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && <p className="text-error text-sm">{error}</p>}

            <input
                className={`input bg-base-300 focus:outline-none focus:ring-0 ${error ? "input-error" : ""}`}
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
            />

            <input
                className={`input bg-base-300 focus:outline-none focus:ring-0 ${error ? "input-error" : ""}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onPasswordKeyDown}
                required
                disabled={loading}
            />

            <button
                className={`btn btn-md rounded-md ${loading ? "skeleton" : "btn-primary"}`}
                type="submit"
                disabled={loading}
            >
                Intra in cont
            </button>
        </form>
    )
}
