type Category =
    | "general"
    | "business"
    | "entertainment"
    | "health"
    | "science"
    | "sports"
    | "technology";

type SideMenuLink = {
    title: string;
    href: string;
    icon?: React.ReactNode;
    protected?: boolean;
};

type SideMenuCategory = {
    categoryName?: string;
    links: SideMenuLink[];
    protected?: boolean;
}