import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { providerMap } from "@/auth.config";
import { AuthError } from "next-auth";
import PasswordInput from "@/components/auth/PasswordInput";
import ButtonWithSignIn from "@/components/auth/ButtonWithSignIn";

const SIGNIN_ERROR_URL = "/error";
const CREDENTIALS_ENABLED = false;

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const awaitedSearchParams = await searchParams;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-primaryBg dark:bg-primaryBg-dark text-white p-6 font-ttFors">
            <div className="w-full max-w-md bg-secondaryBg dark:bg-secondaryBg-dark shadow-xl rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

                {/* Single Form to capture all inputs */}
                <form
                    action={async (formData) => {
                        "use server";
                        const email = formData.get("email") as string;
                        const password = formData.get("password") as string;
                        const signInMethod = formData.get("signInMethod") as string; // Get the selected sign-in method
                        const emailRequired = Boolean(formData.get("emailRequired"));

                        // Check if email is required for the selected sign-in method
                        if (emailRequired) {
                            if (!email) {
                                return redirect(`${SIGNIN_ERROR_URL}?error=EMAIL_REQUIRED`);
                            }
                        }

                        // Handle credentials-based sign-in
                        if (signInMethod === "credentials" && password) {
                            try {
                                await signIn("credentials", formData);
                            } catch (error) {
                                if (error instanceof AuthError) {
                                    return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                                }
                                throw error;
                            }
                        }

                        // Handle social provider sign-in
                        if (signInMethod !== "credentials") {
                            try {
                                await signIn(signInMethod, {
                                    // email,
                                    redirectTo: (await awaitedSearchParams)?.callbackUrl ?? "",
                                });
                            } catch (error) {
                                if (error instanceof AuthError) {
                                    return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                                }
                                throw error;
                            }
                        }
                    }}
                    className="space-y-4"
                >
                    {/* Email Input */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                            <div className="mb-2">Email</div>
                            <div className="relative bg-primaryBg dark:bg-primaryBg-dark w-full rounded-md">
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-md bg-inherit text-white focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-gray-400"
                                />
                            </div>
                        </label>
                    </div>

                    {/* Password Section: Only for credentials-based sign-in */}
                    {CREDENTIALS_ENABLED && (
                        <div className="mb-6">
                            <PasswordInput />
                        </div>
                    )}

                    {/* Hidden field to track sign-in method and email required */}
                    <input type="hidden" name="signInMethod" value="credentials" />
                    <input type="hidden" name="emailRequired" value="false" />

                    {/* Sign In Button for Credentials */}
                    {CREDENTIALS_ENABLED && (
                        <ButtonWithSignIn
                            key={"credentials"}
                            signInMethod={"credentials"}
                            providerId={"credentials"}
                            providerName={"Credentials"}
                        />
                    )}

                    {/* Horizontal lines with text in between */}
                    <div className="flex items-center my-6 text-gray-200">
                        <hr className="flex-grow border-t border-black dark:border-white opacity-30" />
                        <span className="mx-4 text-sm">Or sign in with</span>
                        <hr className="flex-grow border-t border-black dark:border-white opacity-30" />
                    </div>

                    {/* Social Provider Sign In Section */}
                    <div className="mt-6 space-y-4">
                        {Object.values(providerMap).map((provider) => {
                            const { id, name, type } = provider;
                            return (
                                <ButtonWithSignIn
                                    key={id}
                                    signInMethod={id}
                                    providerId={id}
                                    providerName={name}
                                    providerType={type}
                                />
                            );
                        })}
                    </div>
                </form>
            </div>
        </div>
    );
}
