import { auth } from "@/auth";
import ArticleCreationForm from "@/components/ArticleCreationForm";
import { redirect } from "next/navigation";

export default async function NewArticlePage() {
    const session = await auth();
    if (!session) redirect('/api/auth/signin');

    const user = session.user;
    if (!user) redirect('/api/auth/signin');

    const email = user.email;
    if (!email) redirect('/api/auth/signin');
    
    // Get the user ID from the email
    const dbUser = await db.user.findUnique({ where: { email } });
    if (!dbUser) return <div>User not found</div>;

    const id = dbUser.id;

    return <ArticleCreationForm authorId={id} />
};