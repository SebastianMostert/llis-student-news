// components/auth/ButtonWithSignIn.tsx
"use client"; // Ensure this is a Client Component

interface ButtonWithSignInProps {
    signInMethod: string;
    providerId: string;
    providerName: string;
    providerType?: string;
}

const ButtonWithSignIn: React.FC<ButtonWithSignInProps> = ({ signInMethod, providerId, providerName, providerType }) => {
    const handleClick = () => {
        const signInMethodInput = document.querySelector('input[name="signInMethod"]') as HTMLInputElement;
        signInMethodInput.value = signInMethod;

        const emailRequiredInput = document.querySelector('input[name="emailRequired"]') as HTMLInputElement;
        emailRequiredInput.value = providerType === "email" ? "true" : "false";
    };

    return (
        <button
            type="submit"
            name="provider"
            value={providerId}
            onClick={handleClick}
            className="w-full py-3 px-6 bg-accent hover:bg-accent-hover dark:bg-accent-dark dark:hover:bg-accent-hover-dark text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition duration-200"
        >
            Sign in with {providerType === "email" ? "Email" : providerName}
        </button>
    );
};

export default ButtonWithSignIn;
