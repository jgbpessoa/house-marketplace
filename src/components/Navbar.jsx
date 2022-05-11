import { NavLink } from "react-router-dom";
import { ReactComponent as OffersIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";

function Navbar() {
  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li>
            <NavLink className="navbarListItem" to="/">
              {({ isActive }) => (
                <>
                  <ExploreIcon
                    fill={isActive ? "#2c2c2c" : "#8f8f8f"}
                    width="36px"
                    height="36px"
                  />
                  <p
                    className={
                      isActive
                        ? "navbarListItemNameActive"
                        : "navbarListItemName"
                    }
                  >
                    Explore
                  </p>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/offers" className="navbarListItem">
              {({ isActive }) => (
                <>
                  <OffersIcon
                    fill={isActive ? "#2c2c2c" : "#8f8f8f"}
                    width="36px"
                    height="36px"
                  />
                  <p
                    className={
                      isActive
                        ? "navbarListItemNameActive"
                        : "navbarListItemName"
                    }
                  >
                    Offers
                  </p>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="navbarListItem">
              {({ isActive }) => (
                <>
                  <PersonOutlineIcon
                    fill={isActive ? "#2c2c2c" : "#8f8f8f"}
                    width="36px"
                    height="36px"
                  />
                  <p
                    className={
                      isActive
                        ? "navbarListItemNameActive"
                        : "navbarListItemName"
                    }
                  >
                    Profile
                  </p>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;
