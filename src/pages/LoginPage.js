import React, { Component }  from 'react';
import api, { ENDPOINT } from "../config/api";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Card from "../components/elements/Card";
import Alert from "../components/elements/Alert";
import Loading from "../components/elements/Loading";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [response, setResponse] = useState({
    status: null,
    message: null,
    error: null,
  });
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);

    if (
      errorUsername ||
      errorPassword ||
      username.length === 0 ||
      password.length === 0
    ) {
      return false;
    }

    setShowLoading(true);
    await api
      .post("/auth/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        setResponse(response.data);
        setShowAlert(true);
        if (response.data.error === false) {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("username", response.data.data.username);
          localStorage.setItem("nama", response.data.data.nama);
          localStorage.setItem("foto", response.data.data.foto);
          localStorage.setItem("role", response.data.data.role);
          localStorage.setItem("token", response.data.token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setShowLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Page de connexion | INVENTORY</title>
      </Helmet>
      {showLoading ? (
        <div className="fixed bg-transparent w-full h-full z-30">
          <div
            className="fixed top-1/2 left-1/2 text-white transform -translate-y-1/2 -translate-x-1/2 rounded-lg px-8 py-3"
            style={{ backgroundColor: "#00000097" }}>
            <Loading>
              <div className="font-montserrat text-gray-300 mt-2">Chargement...</div>
            </Loading>
          </div>
        </div>
      ) : null}
      <Alert
        show={showAlert}
        afterClose={() => {
          setShowAlert(false);
          if (response.error === false) {
            history.push("/");
          }
        }}>
        {response.error ? (
          <div
            className={`bg-red-300 font-bold text-sm text-white rounded-lg px-8 py-3`}>
            {response.message}
          </div>
        ) : (
          <div
            className={`bg-green-300 font-bold text-sm text-white rounded-lg px-8 py-3`}>
            {response.message}
          </div>
        )}
      </Alert>
      <div className="font-poppins flex flex-col items-center bg-gray-200 h-screen px-4">
        <Card className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/6 m-auto">
          <img
            src={`${ENDPOINT}/img/logo.jpeg`}
            alt="Logo"
            className="ring-2 ring-offset-4 ring-indigo-200 shadow-lg rounded-full object-cover w-20 h-20 mx-auto"
          />
          <div className="font-montserrat font-bold text-gray-500 text-xl text-center mt-4 mb-2">
            INVENTORY
          </div>
          <div className="border-b-2 w-1/4 mx-auto mb-6"></div>
          <form onSubmit={handleOnSubmit}>
            <div className="flex flex-col space-y-1 mb-4">
              <div className="font-lato font-bold text-gray-500">Nom d'utilisateur</div>
              <input
                type="text"
                className="border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 p-2"
                placeholder="Nom d'utilisateur"
                autoFocus
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/[^a-zA-Z0-9]/.test(value)) {
                    setErrorUsername(
                      "Le nom d'utilisateur doit être composé de lettres ou de chiffres."
                    );
                  } else if (value.length === 0) {
                    setErrorUsername("Le nom d'utilisateur Doit être rempli.");
                  } else {
                    setErrorUsername(false);
                  }
                  setUsername(value);
                }}
              />
              <div className="text-sm tracking-wide text-red-500">
                {errorUsername}
              </div>
            </div>
            <div className="flex flex-col space-y-1 mb-4">
              <div className="font-lato font-bold text-gray-500">Mot de passe</div>
              <input
                type="password"
                className="border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 p-2"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length === 0) {
                    setErrorPassword("Doit être rempli.");
                  } else if (value.length < 6) {
                    setErrorPassword("Doit être d'au moins 6 caractères.");
                  } else {
                    setErrorPassword(false);
                  }
                  setPassword(value);
                }}
              />
              <div className="text-sm tracking-wide text-red-500">
                {errorPassword}
              </div>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5">
              Connecter
            </button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
