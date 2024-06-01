import React from "react";
import googlePlayBadge from "../../../assets/images/google_play_badge.png";
import appStoreBadge from "../../../assets/images/app_store_badge.png";
import "./HomePage.scss";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="container">
        <div className="homepage__content">
          <h1 className="homepage__title">Zanger.AI</h1>
          <p className="homepage__subtitle">Ваш персональный ассистент по правовым вопросам.</p>
          <Link to="/chat">
            <button className="homepage__button">Задать вопрос</button>
          </Link>
          <p className="homepage__text">Для расширенного функционала и удобства, прошу скачать наше приложение.</p>
          <div className="homepage__badges">
            <img src={appStoreBadge} alt="Download on the App Store" />
            <img src={googlePlayBadge} alt="Get it on Google Play" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
