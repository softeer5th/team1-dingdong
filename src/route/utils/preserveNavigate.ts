import navigateTo from "@/route/utils/navigateTo.ts";

export default function preserveNavigate(request: Request) {
    const nextPathname = new URL(request.url).pathname;
    if (nextPathname !== window.location.pathname) {
        navigateTo(window.location.pathname)
    }
}