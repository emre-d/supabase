import React from 'react'
import { useUser } from '../context/UserContext'
const Dashboard = () => {
  const { user } = useUser()
  return (
    <>
    <div>Dashboard</div>
    {user && (
      <div>
        <h1>Welcome, {user.username}!</h1>
        <p>Email: {user.email}</p>
        <p>Supa ID: {user.supa_id}</p>
      </div>
    )}
    </>
  )
}

export default Dashboard