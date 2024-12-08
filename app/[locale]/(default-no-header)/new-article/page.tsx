import { auth } from "@/auth";
import ArticleCreationForm from "@/components/ArticleCreationForm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db"; // Database
import { getTranslations } from 'next-intl/server';

export default async function NewArticlePage() {
    const t = await getTranslations('NewArticle');
    const session = await auth();

    if (!session?.user?.email) {
        return redirect('/api/auth/signin');
    }

    const dbUser = await db.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) {
        return <div>{t('userNotFound')}</div>;
    }

    return <ArticleCreationForm authorId={dbUser.id} />;
}
