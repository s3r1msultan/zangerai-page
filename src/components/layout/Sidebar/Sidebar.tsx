// src/components/layout/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/chat">Задать вопрос</NavLink>
        </li>
        <li>
          <NavLink to="/companies">Связаться с юристом</NavLink>
        </li>
        <li>
          <NavLink to="/documents">Нормативные Правовые Акты</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
