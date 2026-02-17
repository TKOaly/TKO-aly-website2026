import NextAuth, { type AuthOptions, type DefaultUser } from "next-auth"
import Credentials from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & { admin: boolean }
    accessToken?: string
  }

  interface User {
    admin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    admin: boolean
    accessToken?: string
  }
}

const config: AuthOptions = {
  debug: !!process.env.AUTH_DEBUG,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.admin = user.admin
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.admin = token.admin
      }

      return session
    },
  },
  providers: [
    {
      id: "tkoaly",
      name: "TKO-äly Member Account",
      type: "oauth",
      profile: async profile => {
        return {
          id: profile.sub,
          name: profile.nickname,
          admin: ["yllapitaja", "virkailija"].includes(profile.role),
        }
      },
      wellKnown: `${process.env.USER_SERVICE_URL}/.well-known/openid-configuration`,
      clientId: process.env.SERVICE_ID,
      clientSecret: process.env.SERVICE_SECRET,
      authorization: {
        params: { scope: "openid role profile" },
      },
    },
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Hardcoded credentials for easy testing
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin"
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@tko-aly.fi",
            admin: true,
          }
        }
        if (
          credentials?.username === "user" &&
          credentials?.password === "user"
        ) {
          return {
            id: "2",
            name: "Regular User",
            email: "user@tko-aly.fi",
            admin: false,
          }
        }
        return null
      },
    }),
  ],
}

export const handler = NextAuth(config)
