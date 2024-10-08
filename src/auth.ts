import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials: any) => {
        if (credentials.email) {
          return {
            email: credentials.email,
            name: credentials.name,
            id: credentials._id,
            myReferralCode: credentials.myReferralCode
          }
        }
        else {
          throw new CredentialsSignin({ cause: 'Invalid credentials' })
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, account, session, profile }) {
      if (user) {
        token.id = user.id
        token.myReferralCode = (user as any).myReferralCode
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        (session as any).user.myReferralCode = token.myReferralCode
      }
      return session
    },

  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  }
  // useSecureCookies: true,
  // cookies: {
  //   sessionToken: {
  //     name: 'token',
  //     options: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  //       sameSite: 'lax',
  //       path: '/'
  //     }
  //   }
  // }
})