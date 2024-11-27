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
};

type SideMenuCategory = {
    categoryName?: string;
    links: SideMenuLink[];
}