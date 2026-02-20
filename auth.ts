import NextAuth, { type AuthOptions, type DefaultUser } from "next-auth"
import { OAuthConfig } from "next-auth/providers/oauth"

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

interface AuthProfile {
  sub: string
  nickname: string
  role: string
}

const config: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.admin = user.admin
      if (account?.access_token) token.accessToken = account.access_token
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.admin = token.admin
      }
      session.accessToken = token.accessToken
      return session
    },
  },
  providers: [
    {
      id: "tkoaly",
      name: "TKO-äly Member Account",
      type: "oauth",
      profile: async (profile: AuthProfile) => {
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
    } satisfies OAuthConfig<AuthProfile>,
  ],
}

export const handler = NextAuth(config)
