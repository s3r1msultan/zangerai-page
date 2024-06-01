import React, { useEffect, useRef, useState } from "react";
import "./Header.scss";
import logo from "../../../assets/images/logo.png";
import userIcon from "../../../assets/icons/user_icon.svg";

import { Link } from "react-router-dom";
import { RootState } from "../../../app/store";
import { logOut } from "../../../app/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const Header: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useAppDispatch();
  const userDB = useAppSelector((state: RootState) => state.auth.userDB);
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleLogout = () => {
    dispatch(logOut());
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <Link to={"/"}>
              <img src={logo} alt="Zanger AI Logo" />
            </Link>
          </div>
          <div className="header__title">
            <Link to={"/"}>
              <h1>Zanger.AI</h1>
            </Link>
          </div>
          <div className="user__dropdown">
            <button className="user__button" onClick={toggleDropdown}>
              <img src={userIcon} alt="User Avatar" />
            </button>
            {dropdownVisible && (
              <div className="dropdown__menu" ref={dropdownRef}>
                {isAuthenticated ? (
                  <div className="user__info">
                    <p>
                      {userDB?.firstName} {userDB?.lastName}
                    </p>
                    <button onClick={handleLogout} className="logout__button">
                      Выйти
                    </button>
                  </div>
                ) : (
                  <button className="login__button">
                    <Link to={"/login"}>Войти</Link>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
