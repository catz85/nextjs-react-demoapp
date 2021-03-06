import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumb } from 'react-bootstrap';
import useUser from "../lib/useUser";
const BreadCrumb = () => {
    const { user, mutateUser } = useUser();
    const router = useRouter()
    const [hasMounted, setHasMounted] = React.useState(false);
    React.useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    const capitalizeFirstLetter = (str:string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    let routesArray;
    let url = router.asPath; try { url = (new URL(router.asPath)).pathname; } catch (e) { } finally { }
    if (url !== '/') {
        routesArray = url.split('/')
    } else {
        routesArray = ['']
    }
    const breadcrumbs = Array.from(new Set(routesArray.map((item) => {
        let path = item === `` ? `/` : `/${item}`;
        let title = item === `` ? 'home' : item;
        return {
            href: path,
            title: capitalizeFirstLetter(title)
        }
    })))


    return (
        <>
            {user?.isLoggedIn && (
                <Breadcrumb>
                    {
                        breadcrumbs.map(({ title, href }, index, arr) => (index === arr.length - 1)
                            ? <Breadcrumb.Item active key={`breadcrumb-${index}`}>{title}</Breadcrumb.Item>
                            : <Breadcrumb.Item href={href} key={`breadcrumb-${index}`} onClick={async (e) => {
                                e.preventDefault();
                                router.push(href);
                            }}>{title}</Breadcrumb.Item>
                        )
                    }</Breadcrumb>
            )}
        </>
    )
}
export default BreadCrumb;