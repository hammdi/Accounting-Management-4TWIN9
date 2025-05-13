import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import {getCurrentUser} from "../services/authService";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: '#menu-dashboard',
      popover: {
        title: 'Dashboard',
        description: 'Your central hub for company insights, charts, and activities.',
        side: "top",
        align: 'start',
      },
    },
      {
      element: '#menu-projects',
      popover: {
        title: 'Accounting Projects',
        description: 'Track and manage accounting tasks. Organize by status (To Do/In Progress/Done) with due dates and priorities.',
        side: "left-top",
        align: 'start',
      },
    },
    {
      element: '#menu-emails',
      popover: {
        title: 'Emails',
        description: 'Manage, send, and view all company emails here.',
        side: "top-right",
        align: 'start',
      },
    },
    {
      element: '#menu-calendar',
      popover: {
        title: 'Invoice Calendar',
        description: 'Check your invoice due dates and schedule with clarity.',
        side: "bottom",
        align: 'start',
      },
    },
    {
      element: '#menu-invoices',
      popover: {
        title: 'Invoices',
        description: 'Track and manage customer invoices, payments, and statuses.',
        side: "top",
        align: 'start',
      },
    },
    {
      element: '#menu-transactions',
      popover: {
        title: 'Transactions',
        description: 'View transaction history, payment methods, and transfers.',
        side: "bottom-left",
        align: 'start',
      },
    },
    {
      element: '#menu-accounting',
      popover: {
        title: 'Accounting',
        description: 'Core financial tools: general ledger, reports, and budgeting.',
        side: "top-center",
        align: 'start',
      },
    },
    {
      element: '#menu-companies',
      popover: {
        title: 'Companies',
        description: 'Manage company profiles, details, and registration data.',
        side: "bottom-center",
        align: 'start',
      },
    },
    {
      element: '#menu-ai',
      popover: {
        title: 'AI Application',
        description: 'Use our AI assistant to generate financial insights or reports.',
        side: "right",
        align: 'start',
      },
    },
    {
      element: '#menu-users',
      popover: {
        title: 'Users',
        description: 'Manage users, roles, and access permissions.',
        side: "left",
        align: 'start',
      },
    },
    {
      element: '#menu-payroll',
      popover: {
        title: 'Payroll',
        description: 'Setup salaries, bonuses, deductions, and process payrolls.',
        side: "right-bottom",
        align: 'start',
      },
    },
    {
      element: '#menu-tax',
      popover: {
        title: 'Tax Compliance',
        description: 'Review tax obligations, filing statuses, and compliance checks.',
        side: "left-top",
        align: 'start',
      },
    },
  ]
});



const getUserAvatar = (avatar) => {
  if (avatar) {
    // Vérifie si l'avatar est déjà une chaîne Base64
    if (typeof avatar === 'string' && avatar.startsWith('data:image/png;base64,')) {
      return avatar; // L'avatar est déjà au format Base64
    }
    // Si l'avatar est un objet Buffer avec un tableau de données
    if (avatar && avatar.data && Array.isArray(avatar.data)) {
      // Convertir les données du tableau en chaîne Base64
      const base64Avatar = arrayBufferToBase64(new Uint8Array(avatar.data));
      //console.log("Avatar converti en Base64:", base64Avatar); // Affiche l'avatar converti
      return `data:image/png;base64,${base64Avatar}`;
    }

    console.log("L'avatar n'est pas un format valide.");
  }

  return "default-avatar.png"; // Image par défaut si l'avatar est vide ou invalide
};

// Fonction utilitaire pour convertir un tableau Uint8Array en chaîne Base64
const arrayBufferToBase64 = (uint8Array) => {
  let binary = '';
  const len = uint8Array.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return window.btoa(binary); // Convertir en Base64
};//////////////////////

const MasterLayout = ({ children }) => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      console.log(userData)
      if (userData) {
        setUser(userData);

      }
    };
    fetchUser().then(r => console.log(""));
  }, []);
  useEffect(() => {

    if (location.pathname == "/home") {
      driverObj.drive();    }


    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
        ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
              link.getAttribute("href") === location.pathname ||
              link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };



  const [language, setLanguage] = useState("en"); // Langue par défaut

  const handleLanguageChange = (lang) => {
    setLanguage(lang); // Met à jour la langue sélectionnée
  }





  return (









      <section className={mobileMenu ? "overlay active" : "overlay "}>


























        {/* sidebar */}
        <aside
            className={
              sidebarActive
                  ? "sidebar active "
                  : mobileMenu
                      ? "sidebar sidebar-open"
                      : "sidebar"
            }
        >
          <button
              onClick={mobileMenuControl}
              type='button'
              className='sidebar-close-btn'
          >
            <Icon icon='radix-icons:cross-2' />
          </button>
          <div>
            <Link to='/home' className='sidebar-logo'>
              <img src="assets/images/logo.png"      alt="MiLiM Logo" className="mb-3" />

            </Link>
          </div>
          <div className='sidebar-menu-area'>
            <ul className='sidebar-menu' id='sidebar-menu'>
              <li className='dropdown'>
                <Link to='#' id='menu-dashboard'>
                  <Icon
                      icon='solar:home-smile-angle-outline'
                      className='menu-icon'
                  />
                  <span>Dashboard</span>
                </Link>
                <ul className='sidebar-submenu'>

                  <li>
                    <NavLink
                        to='/home'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                      Invoices
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/index-2'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      transactions
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/index-3'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                      Payroll
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/index-4'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-danger-main w-auto' />
                      Tax Compliance
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                        to='/index-5'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                      User
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/index-6'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                      Company
                    </NavLink>
                  </li>
                  {/*    <li>
                  <NavLink
                    to='/index-7'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    NFT &amp; Gaming
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-8'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Medical
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-9'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Analytics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-10'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    POS & Inventory
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-11'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Finance & Banking
                  </NavLink>
                </li>*/}
                </ul>
              </li>

              <li className='sidebar-menu-group-title'>Application</li>


              <li>
                <NavLink
                    to='/projects' id='menu-projects'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon icon='mdi:clipboard-check-outline' className='menu-icon' />
                  <span>Accounting Projects</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                    to='/email' id='menu-emails'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon icon='mage:email' className='menu-icon' />
                  <span>Emails</span>
                </NavLink>
              </li>
              {/* <li>
              <NavLink
                to='/chat-message'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='bi:chat-dots' className='menu-icon' />
                <span>Chat</span>
              </NavLink>
            </li> */}
              <li>
                <NavLink
                    to='/calendar-main'  id='menu-calendar'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon icon='solar:calendar-outline' className='menu-icon' />
                  <span>Invoice Calendar</span>
                </NavLink>
              </li>
                  
 {/* 
              <li>
                <NavLink
                    to='/kanban'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon
                      icon='material-symbols:map-outline'
                      className='menu-icon'
                  />
                  <span>Kanban</span>
                </NavLink>
              </li> */}

              {/* Invoice Dropdown */}
              <li className='dropdown'>
                <Link to='#'  id='menu-invoices'>
                  <Icon icon='hugeicons:invoice-03' className='menu-icon' />
                  <span>Invoice</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/invoice-list'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/invoice-add'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                      Add new
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Transaction Dropdown */}
              <li className='dropdown'>
                <Link to='#' id='menu-transactions'>
                  <Icon icon='mdi:finance' className='menu-icon' />
                  <span>Transaction</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/transaction-list'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/transaction-add'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                      Add new
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* accounting Dropdown */}
              <li className='dropdown'>
                <Link to='#' id='menu-accounting'>
                  <Icon icon='mdi:dollar' className='menu-icon' />
                  <span>Accounting</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/comptes'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      accounting plan
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/ecritures/nouveau'
                        className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />
                      New Entry
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/plan-comptable'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      financial statements
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Company Dropdown */}
              <li className='dropdown'>
                <Link to='#' id='menu-companies'>
                  <Icon icon='mdi:briefcase' className='menu-icon' />
                  <span>Companies</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/my-companies'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      All Companies
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/company'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      Add Company
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Ai Application Dropdown */}
              <li className='dropdown'>
                <Link to='#'  id='menu-ai'>
                  <i className='ri-robot-2-line mr-10' />

                  <span>Ai Application</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/text-generator'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Text Generator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/code-generator'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      Code Generator
                    </NavLink>
                  </li>
                  {/*      <li>
                  <NavLink
                    to='/image-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Image Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/voice-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Voice Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/video-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Video Generator
                  </NavLink>
                </li>   */}
                </ul>
              </li>

              {/* Crypto Currency Dropdown */}
              {/*       <li className='dropdown'>
              <Link to='#'>
                <i className='ri-btc-line mr-10' />
                <span>Crypto Currency</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/wallet'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Wallet
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/marketplace'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    Marketplace
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/marketplace-details'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    Marketplace Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/portfolio'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    Portfolios
                  </NavLink>
                </li>
              </ul>
            </li>
  
            <li className='sidebar-menu-group-title'>UI Elements</li>

            {/* Components Dropdown */}
              {/*   <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='solar:document-text-outline'
                  className='menu-icon'
                />
                <span>Components</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/typography'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                    Typography
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/colors'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Colors
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/button'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dropdown'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-lilac-600 w-auto' />{" "}
                    Dropdown
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/alert'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Alerts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/card'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Card
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/carousel'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Carousel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/avatar'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Avatars
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/progress'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Progress bar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/tabs'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Tab &amp; Accordion
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/pagination'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />
                    Pagination
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/badges'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Badges
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/tooltip'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-lilac-600 w-auto' />{" "}
                    Tooltip &amp; Popover
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/videos'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-cyan w-auto' />{" "}
                    Videos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/star-rating'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-indigo w-auto' />{" "}
                    Star Ratings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/tags'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    Tags
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/list'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-red w-auto' />{" "}
                    List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/calendar'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-yellow w-auto' />{" "}
                    Calendar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/radio'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-orange w-auto' />{" "}
                    Radio
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/switch'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-pink w-auto' />{" "}
                    Switch
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/image-upload'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Upload
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Forms Dropdown */}
              {/*      <li className='dropdown'>
              <Link to='#'>
                <Icon icon='heroicons:document' className='menu-icon' />
                <span>Forms</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/form'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Input Forms
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/form-layout'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Input Layout
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/form-validation'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Form Validation
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/wizard'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Form Wizard
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Table Dropdown */}
              {/*      <li className='dropdown'>
              <Link to='#'>
                <Icon icon='mingcute:storage-line' className='menu-icon' />
                <span>Table</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/table-basic'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Basic Table
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/table-data'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Data Table
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Chart Dropdown */}
              {/*       <li className='dropdown'>
              <Link to='#'>
                <Icon icon='solar:pie-chart-outline' className='menu-icon' />
                <span>Chart</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/line-chart'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Line Chart
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/column-chart'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Column Chart
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/pie-chart'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Pie Chart
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to='/widgets'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='fe:vector' className='menu-icon' />
                <span>Widgets</span>
              </NavLink>
            </li>  */}


              {/* Users Dropdown */}
              <li className='dropdown'>
                <Link to='#' id='menu-users'>
                  <Icon
                      icon='flowbite:users-group-outline'
                      className='menu-icon'
                  />
                  <span>Users</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/users-list'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Users List
                    </NavLink>
                  </li>
                  {/*        <li>
                  <NavLink
                    to='/users-grid'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Users Grid
                  </NavLink>
                </li>     
                <li>
                  <NavLink
                    to='/add-user'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Add User
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/view-profile'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    View Profile
                  </NavLink>
                </li>*/}
                </ul>
              </li>
              <li className='dropdown'>
                <Link to='#' id='menu-payroll'>
                  <Icon
                      icon='simple-line-icons:vector'
                      className='menu-icon'
                  />
                  <span>Payroll</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/payroll-list'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Payroll List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/add-payroll'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                      Add Payroll
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className='dropdown'>
                <Link to='#' id='menu-tax'>
                  <Icon
                      icon='hugeicons:money-send-square'
                      className='menu-icon'
                  />
                  <span>Tax Compliance</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                        to='/taxcompliance-list'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Tax Compliance List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                        to='/add-taxcompliance'
                        className={(navData) =>
                            navData.isActive ? "active-page" : ""
                        }
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                      Add Tax Compliance
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Role & Access Dropdown */}
              {/*       <li className='dropdown'>
              <Link to='#'>
                <i className='ri-user-settings-line' />
                <span>Role &amp; Access</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/role-access'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Role &amp; Access
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/assign-role'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Assign Role
                  </NavLink>
                </li>
              </ul>
            </li>   */}

              <li className='sidebar-menu-group-title'>Application</li>

              {/* Authentication Dropdown */}
              {/*         <li className='dropdown'>
              <Link to='#'>
                <Icon icon='simple-line-icons:vector' className='menu-icon' />
                <span>Authentication</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/sign-in'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Sign In
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/sign-up'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/forgot-password'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Forgot Password
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* gallery */}

              {/*     <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>Gallery</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/gallery-grid'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Gallery Grid
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gallery'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Gallery Grid Desc
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gallery-masonry'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Gallery Grid
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gallery-hover'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Gallery Hover Effect
                  </NavLink>
                </li>
              </ul>
            </li>
     */}
              <li>
                <NavLink
                    to='/pricing'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon
                      icon='hugeicons:money-send-square'
                      className='menu-icon'
                  />
                  <span>Pricing</span>
                </NavLink>
              </li>

              {/* Blog */}

              {/*       <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>Blog</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/blog'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/blog-details'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Blog Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/add-blog'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Add Blog
                  </NavLink>
                </li>
              </ul>
            </li>
 */}
              <li>
                <NavLink
                    to='/testimonials'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon
                      icon='mage:message-question-mark-round'
                      className='menu-icon'
                  />

                  <span>Testimonials</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                    to='/faq'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon
                      icon='mage:message-question-mark-round'
                      className='menu-icon'
                  />
                  <span>FAQs.</span>
                </NavLink>
              </li>
              {/*       <li>
              <NavLink
                to='/error'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='streamline:straight-face' className='menu-icon' />
                <span>404</span>
              </NavLink>
            </li>   */}
              <li>
                <NavLink
                    to='/terms-condition'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon icon='octicon:info-24' className='menu-icon' />
                  <span>Terms &amp; Conditions</span>
                </NavLink>
              </li>
              {/*              <li>
              <NavLink
                to='/coming-soon'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className='ri-rocket-line menu-icon'></i>
                <span>Coming Soon</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/access-denied'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className='ri-folder-lock-line menu-icon'></i>
                <span>Access Denied</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/maintenance'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className='ri-hammer-line menu-icon'></i>
                <span>Maintenance</span>
              </NavLink>
            </li>  */}
              <li>
                <NavLink
                    to='/blank-page'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <i className='ri-checkbox-multiple-blank-line menu-icon'></i>
                  <span>Blank Page</span>
                </NavLink>
              </li>

              {/* Settings Dropdown */}
              {/*        <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='icon-park-outline:setting-two'
                  className='menu-icon'
                />
                <span>Settings</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/company'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Company
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/notification'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Notification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/notification-alert'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Notification Alert
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/theme'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Theme
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/currencies'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Currencies
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/language'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Languages
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/payment-gateway'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Payment Gateway
                  </NavLink>
                </li>     
              </ul> 
            </li>*/}
            </ul>
          </div>
        </aside>

        <main
            className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
        >
          <div className='navbar-header'>
            <div className='row align-items-center justify-content-between'>
              <div className='col-auto'>
                <div className='d-flex flex-wrap align-items-center gap-4'>
                  <button
                      type='button'
                      className='sidebar-toggle'
                      onClick={sidebarControl}
                  >
                    {sidebarActive ? (
                        <Icon
                            icon='iconoir:arrow-right'
                            className='icon text-2xl non-active'
                        />
                    ) : (
                        <Icon
                            icon='heroicons:bars-3-solid'
                            className='icon text-2xl non-active '
                        />
                    )}
                  </button>
                  <button
                      onClick={mobileMenuControl}
                      type='button'
                      className='sidebar-mobile-toggle'
                  >
                    <Icon icon='heroicons:bars-3-solid' className='icon' />
                  </button>
                  <form className='navbar-search'>
                    <input type='text' name='search' placeholder='Search' />
                    <Icon icon='ion:search-outline' className='icon' />
                  </form>
                </div>
              </div>
              <div className='col-auto'>
                <div className='d-flex flex-wrap align-items-center gap-3'>


                  {/* TUTO */}
                  <div className='dropdown d-none d-sm-inline-block'>
                    <button
                        className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                        type='button'
                        data-bs-toggle='dropdown'
                    >
                      <Icon className='text-black fs-5' icon="mdi:lightbulb-on" />
                    </button>
                    <div className='dropdown-menu to-top dropdown-menu-sm'>
                      <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                        <div>
                          <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                            Learn with Tutorials
                          </h6>
                        </div>
                      </div>
                      <div className='max-h-400-px overflow-y-auto scroll-sm pe-8'>
                        <div className='d-flex align-items-center justify-content-between mb-16'>
                          <a
                              href="#"
                              className='text-black text-md fw-semibold d-flex align-items-center gap-3 hover-text-primary'
                              onClick={(e) => {
                                e.preventDefault();
                                driverObj.drive();
                              }}
                          >
                            <Icon className='text-black' icon="mdi:lightbulb-on" />
                            Getting Started
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* ThemeToggleButton */}
                  <ThemeToggleButton />
                  {/*  <div className='dropdown d-none d-sm-inline-block'>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src='/assets/images/lang-flag.png'
                      alt='Wowdash'
                      className='w-24 h-24 object-fit-cover rounded-circle'
                    />
                  </button>
                   <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Choose Your Language
                        </h6>
                      </div>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-8'>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='english'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag1.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              English
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='english'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='japan'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag2.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Japan
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='japan'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='france'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag3.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              France
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='france'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='germany'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag4.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Germany
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='germany'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='korea'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag5.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              South Korea
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='korea'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='bangladesh'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag6.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Bangladesh
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='bangladesh'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='india'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag7.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              India
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='india'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='canada'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag8.png'
                              alt=''
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Canada
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='canada'
                        />
                      </div>
                    </div>
                  </div> 
                </div>
                */}


                  {/* Language dropdown end
                <div className='dropdown'>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  > 
                    <Icon
                      icon='mage:email'
                      className='text-primary-light text-xl'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                    <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Message
                        </h6>
                      </div>
                      <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                        05
                      </span>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='/assets/images/notification/profile-3.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            8
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-4.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px  bg-neutral-300 rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            2
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-5.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle'>
                            0
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-6.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-neutral-300 rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle'>
                            0
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-7.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            8
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className='text-center py-12 px-16'>
                      <Link
                        to='#'
                        className='text-primary-600 fw-semibold text-md'
                      >
                        See All Message
                      </Link>
                    </div>
                  </div>
                </div>
                  
                
                {/* Message dropdown end 
                  <div className='dropdown'>
                    <button
                        className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                        type='button'
                        data-bs-toggle='dropdown'
                    >
                      <Icon
                          icon='iconoir:bell'
                          className='text-primary-light text-xl'
                      />
                    </button>
                            <NotifLayer />
                  </div>
*/}
                  {/* Notification dropdown end */}
                  <div className='dropdown'>
                    <button
                        className='d-flex justify-content-center align-items-center rounded-circle'
                        type='button'
                        data-bs-toggle='dropdown'
                    >
                      <img
                          src={getUserAvatar(user? user.avatar:"")}

                          alt='image_user'
                          className='w-40-px h-40-px object-fit-cover rounded-circle'
                      />
                    </button>
                    <div className='dropdown-menu to-top dropdown-menu-sm'>
                      <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                        <div>
                          <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                            {user?.name}
                          </h6>
                          <span className='text-secondary-light fw-medium text-sm'>
                          Role : {user?.role}
                        </span>
                        </div>
                        <button type='button' className='hover-text-danger'>
                          <Icon
                              icon='radix-icons:cross-1'
                              className='icon text-xl'
                          />
                        </button>
                      </div>
                      <ul className='to-top-list'>
                        <li>
                          <Link
                              className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                              to='/view-profile'
                          >
                            <Icon
                                icon='solar:user-linear'
                                className='icon text-xl'
                            />{" "}
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                              className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                              to='/email'
                          >
                            <Icon
                                icon='tabler:message-check'
                                className='icon text-xl'
                            />{" "}
                            Inbox
                          </Link>
                        </li>
                        <li>
                          <Link
                              className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                              to='/company'
                          >
                            <Icon
                                icon='icon-park-outline:setting-two'
                                className='icon text-xl'
                            />
                            Setting
                          </Link>
                        </li>
                        <li>
                          <Link
                              className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                              to='/'
                          >
                            <Icon icon='lucide:power' className='icon text-xl' />{" "}
                            Log Out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Profile dropdown end */}
                </div>
              </div>
            </div>
          </div>

          {/* dashboard-main-body */}
          <div className='dashboard-main-body'>{children}</div>

          {/* Footer section */}
          <footer className='d-footer'>
            <div className='row align-items-center justify-content-between'>
              <div className='col-auto'>
                <p className='mb-0'> 2024 MILIM. All Rights Reserved.</p>
              </div>
              <div className='col-auto'>
                <p className='mb-0'>
                  Made by <span className='text-primary-600'>DeadlineTeam</span>
                </p>
              </div>
            </div>
          </footer>
        </main>
      </section>
  );
};

export default MasterLayout;