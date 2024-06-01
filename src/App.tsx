// src/utils/App.tsx
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";
import Header from "./components/layout/Header/Header";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import ChatPage from "./components/pages/ChatPage/ChatPage";
import DocumentsPage from "./components/pages/DocumentsPage/DocumentsPage";
import HomePage from "./components/pages/HomePage/HomePage";
import LawCompaniesPage from "./components/pages/LawCompaniesPage/LawCompaniesPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import RegisterPage from "./components/pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
import Footer from "./components/layout/Footer/Footer";
import { loadUserFromSession } from "./app/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(loadUserFromSession());
  }, [dispatch]);
  return (
    <>
      <Header />
      <div className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <div className="main-layout">
                    <Sidebar />
                    <div className="content">
                      <ChatPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <div className="main-layout">
                    <Sidebar />
                    <div className="content ">
                      <DocumentsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute>
                  <div className="main-layout">
                    <Sidebar />
                    <div className="content">
                      <LawCompaniesPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
