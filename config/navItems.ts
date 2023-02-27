interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: "Migrate Email", href: "/migrate", current: false },
]

export default navigation;