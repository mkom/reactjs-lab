import { http, HttpResponse } from 'msw'

const mockUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'user@example.com',
    role: 'admin',
  },
]

const randomDelay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700))

let currentUser = mockUsers[0]

export const handlers = [
  // AUTH HANDLERS
  http.post('/api/auth/login', async ({ request }) => {
    await randomDelay()
    
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'user@example.com' && body.password === 'password') {
      const token = 'mock_jwt_token_' + Date.now()
      const refreshToken = 'mock_refresh_token_' + Date.now()
      localStorage.setItem('token', token)
      localStorage.setItem('refresh_token', refreshToken)
      
      return HttpResponse.json({
        user: currentUser,
        token,
        refresh_token: refreshToken,
      })
    }
    
    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await randomDelay()
    
    const body = await request.json() as { name: string; email: string; password: string }
    
    const newUser = {
      id: String(Date.now()),
      name: body.name,
      email: body.email,
      role: 'user',
    }
    
    const token = 'mock_jwt_token_' + Date.now()
    const refreshToken = 'mock_refresh_token_' + Date.now()
    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', refreshToken)
    currentUser = newUser
    
    return HttpResponse.json({
      user: newUser,
      token,
      refresh_token: refreshToken,
    })
  }),

  http.post('/api/auth/logout', async () => {
    await randomDelay()
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', async () => {
    await randomDelay()
    
    const token = localStorage.getItem('token')
    if (!token) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json(currentUser)
  }),

  http.post('/api/auth/refresh', async () => {
    await randomDelay()
    
    const newToken = 'mock_jwt_token_' + Date.now()
    localStorage.setItem('token', newToken)
    
    return HttpResponse.json({
      access_token: newToken,
    })
  }),
]