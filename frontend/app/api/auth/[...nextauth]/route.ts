import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch("http://localhost:8000/auth/token", {
          method: 'POST',
          body: new URLSearchParams({
            username: credentials.username,
            password: credentials.password
          }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        const data = await res.json()

        if (res.ok && data.access_token) {
          return { id: credentials.username, email: credentials.username, accessToken: data.access_token }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken
      return session
    }
  }
})

export { handler as GET, handler as POST }
