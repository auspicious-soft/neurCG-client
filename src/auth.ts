import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { getUserInfoByEmail } from "./services/user-service"


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
            myReferralCode: credentials.myReferralCode,
            profilePic: credentials.profilePic
          }
        }
        else {
          throw new CredentialsSignin({ cause: 'Invalid credentials' })
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    signIn: async ({ account, user }) => {
      if (account?.provider === 'google') {
        try {
          const { email, name, image, id } = user
          console.log('user: ', user);
          const userAlreadyExists = await getUserInfoByEmail(`/user/email/${email}`)
          console.log('userAlreadyExists: ', userAlreadyExists);
          // if (!userAlreadyExists) {
          //   await googlePostUser(name as string, email as string, image as string, id as string)
          // }
        } catch (error) {
          throw new AuthError({ cause: 'Error creating user' })
        }
      }
      return true
    },
    jwt({ token, user, account, session, profile }) {
      if (user) {
        token.id = user.id
        token.myReferralCode = (user as any).myReferralCode
        token.picture = (user as any).profilePic
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        (session as any).user.myReferralCode = token.myReferralCode
        session.user.image = token.picture
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