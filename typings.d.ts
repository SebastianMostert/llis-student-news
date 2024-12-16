type Category =
    | "general"
    | "business"
    | "entertainment"
    | "health"
    | "science"
    | "sports"
    | "technology";

type SideMenuLink = {
    titleTranslationKey: string;
    href: string;
    icon?: React.ReactNode;
    protected?: boolean;
};

type SideMenuCategory = {
    categoryNameTranslationKey?: string;
    links: SideMenuLink[];
    protected?: boolean;
}