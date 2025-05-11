import React from 'react'
import supabase from '../helper/supabaseClient'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({ email:email, password:password })
        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Login successful')
            navigate('/')
        }
    }
  return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <div>{message}</div>
        </>
  )
}

export default Login