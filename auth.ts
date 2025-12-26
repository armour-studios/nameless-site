import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        // Credentials Provider (Username/Password)
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                code: { label: "2FA Code (if enabled)", type: "text", optional: true },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!passwordMatch) {
                    throw new Error("Invalid credentials");
                }

                // Check 2FA if enabled
                if (user.twoFactorEnabled) {
                    if (!credentials.code) {
                        throw new Error("2FA_REQUIRED");
                    }

                    // Verify 2FA code
                    const verificationToken = await prisma.verificationToken.findFirst({
                        where: {
                            identifier: user.email,
                            token: credentials.code as string,
                            type: "2fa",
                            expires: { gt: new Date() },
                        },
                    });

                    if (!verificationToken) {
                        throw new Error("Invalid or expired 2FA code");
                    }

                    // Delete used token
                    await prisma.verificationToken.delete({
                        where: {
                            identifier_token: {
                                identifier: user.email,
                                token: credentials.code as string,
                            },
                        },
                    });
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),

        // Discord OAuth
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID || "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
        }),

        // Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // For OAuth providers, create or update user in database
            if (account?.provider !== "credentials") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (!existingUser) {
                    // Create new user from OAuth
                    await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name || null,
                            image: user.image || null,
                            emailVerified: new Date(),
                        },
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.image = user.image; // Ensure initial image is set
            }

            // Handle updating the session (e.g. when user updates profile)
            if (trigger === "update" && session) {
                token.name = session.name;
                token.image = session.image;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.image = token.image as string; // Pass updated image to session
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});
