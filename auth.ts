import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./database/account.model";

// These callbacks will make sure that our users are authenticated
// They will be called whenever a user signs in using any provider.
 
// with the callbacks we can intercept and customize the auth flow
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token}) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account}) {
      // account exists only during sign-in.
      if(account) {
        // destructuring with rename, taking the data property and store it in a variable called existingAccount 
        const { data: existingAccount, success } = (await api.accounts.getByProvider(
          account.type === "credentials" 
          ? token.email! 
          : account.providerAccountId
        )) as ActionResponse<IAccountDoc>;

        if(!success || !existingAccount) return token;

        const userId = existingAccount.user;

        if(userId) token.sub = userId.toString();
      }

      return token; // modified token that includes user's id
    },
    // This runs right after OAuth succeeds, but before the user is considered logged in.
    // OAuth succeeded → “Do we accept this user in our system?”
    async signIn({ user, profile, account}) {
      if(account?.type === "credentials") return true;
      if(!account || !user) return false; // Safety check

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: 
        account.provider === "github" 
          ? (profile?.login as string) // github
          : (user.name?.toLowerCase() as string) // google
      };

      const { success } = await api.auth.oAuthSignIn({ 
        user: userInfo, 
        provider: account.provider as "github" | "google", 
        providerAccountId: account.providerAccountId,
      }) as ActionResponse;

      if(!success) return false;

      return true;
    }
  },
})