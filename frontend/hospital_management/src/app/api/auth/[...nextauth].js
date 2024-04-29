import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import dotenv from "dotenv"
dotenv.config()

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // Providers.GitHub({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here
    Providers.Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
    }),

    // Providers.Facebook({
    //     clientId: process.env.FACEBOOK_ID,
    //     clientSecret: process.env.FACEBOOK_SECRET
    // }),

    // Providers.Twitter({
    //     clientId: process.env.TWITTER_ID,
    //     clientSecret: process.env.TWITTER_SECRET
    // })

  ],
}

export default NextAuth(authOptions)