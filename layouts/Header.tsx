import React from "react";
import Link from "next/link";
import useUser from "../lib/useUser";
import { useRouter } from "next/router";
import fetchJson from "../lib/fetchJson";
import { Navbar, Nav } from 'react-bootstrap';
import BreadCrumb from './BreadCrumb'
const Header = () => {
    const router = useRouter()
    console.log('ROUTER', router)
    const { user, mutateUser } = useUser();
    const [hasMounted, setHasMounted] = React.useState(false);
    React.useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    return (
        <>
            {user?.isLoggedIn && (
                <>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/" onClick={async (e) => {
                                        e.preventDefault();
                                        router.push("/");
                                    }}>PGApp</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="/photos" onClick={async (e) => {
                                        e.preventDefault();
                                        router.push("/photos");
                                    }}>Photo Gallery</Nav.Link>
                                <Nav.Link href="/favorite" onClick={async (e) => {
                                        e.preventDefault();
                                        router.push("/favorite");
                                    }}>Favorite Photos</Nav.Link>
                                <Nav.Link href="/api/logout"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        router.push("/login");
                                        await mutateUser(fetchJson("/api/logout"));

                                    }}>Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <BreadCrumb />
                </>
            )}
        </>
    )
}
export default Header;