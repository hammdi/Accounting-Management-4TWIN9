import logo from "/assets/img/logo.png";
import MainMenu from './MainMenu';
import useSubMenuToggle from '@/hooks/useSubMenuToggle';
import useStickyMenu from '@/hooks/useStickyMenu';
import useSidebarMenu from '@/hooks/useSidebarMenu';
import { Link } from 'react-router-dom';

const HeaderV1 = () => {

    const toggleSubMenu = useSubMenuToggle();
    const isMenuSticky = useStickyMenu();
    const { isOpen, openMenu, closeMenu } = useSidebarMenu();

    return (
        <>
            <header>
                <nav className={`navbar mobile-sidenav navbar-sticky navbar-default validnavs navbar-fixed dark on menu-center no-full ${isMenuSticky ? 'sticked' : 'no-background'} ${isOpen ? "navbar-responsive" : ""}`} >
                    <div className="container d-flex justify-content-between align-items-center">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={openMenu}>
                                <i className="fa fa-bars" />
                            </button>
                            <Link className="navbar-brand" to="/">
                                <img src={logo} className="logo" alt="Logo" />
                            </Link>
                        </div>

                        <div className={`collapse navbar-collapse ${isOpen ? "show collapse-mobile" : "collapse-mobile"}`} id="navbar-menu">
                            <img src={logo} alt="Logo" />
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={closeMenu}>
                                <i className="fa fa-times" />
                            </button>

                            {/* Main Navigation */}
                            <MainMenu navbarPlacement="navbar-center" toggleSubMenu={toggleSubMenu} />

                            {/* Buttons for mobile (hidden on desktop) */}
                            <ul className="navbar-nav d-lg-none mt-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/sign-in">Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/contact-us">Company Demo</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Buttons for desktop (hidden on mobile) */}
                        <div className="attr-right d-none d-lg-flex">
                            <div className="attr-nav">
                                <ul className="d-flex">
                                    <li className="button" style={{ marginRight: '15px' }}>
                                        <Link to="/sign-in" style={{ textDecoration: "none" }}>Sign In</Link>
                                    </li>
                                    <li className="button">
                                        <Link to="/contact-us" style={{ textDecoration: "none" }}>Company Demo</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                    <div className={`overlay-screen ${isOpen ? "opened" : ""}`} onClick={closeMenu} />
                </nav>
            </header>
        </>
    );
};

export default HeaderV1;
