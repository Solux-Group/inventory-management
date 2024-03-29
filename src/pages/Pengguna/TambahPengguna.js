import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const TambahPengguna = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    password: "",
    no_telp: "",
    role: "",
    status: "",
  });
  const [formDataError, setFormDataError] = useState({
    username: false,
    nama: false,
    email: false,
    password: false,
    no_telp: false,
    role: false,
    status: false,
  });
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const history = useHistory();

  const formValidation = () => {
    let isError = false;

    Object.entries(formData).forEach((data) => {
      let [name, value] = data;

      if (name === "username") {
        value = value.toLowerCase();
      } else if (name === "no_telp") {
        value = value.replace(/\D/g, "");
      } else if (name === "status") {
        value = parseInt(value);
      }

      if (name === "username") {
        if (value.length < 5) {
          isError = true;
          setFormDataError((state) => ({
            ...state,
            [name]: "doit être rempli minimal 5 karakter.",
          }));
        }
      } else if (name === "password") {
        if (value.length < 6) {
          isError = true;
          setFormDataError((state) => ({
            ...state,
            [name]: "doit être rempli d'au moins 6 caractères.",
          }));
        }
      } else if (name === "email") {
        if (value === undefined || value === "") {
          isError = true;
          setFormDataError((state) => ({ ...state, [name]: "doit être rempli." }));
        } else if (!value.includes("@") || !value.includes(".")) {
          isError = true;
          setFormDataError((state) => ({ ...state, [name]: "tidak valid." }));
        }
      } else {
        if (value === undefined || value === "") {
          isError = true;
          setFormDataError((state) => ({ ...state, [name]: "doit être rempli" }));
        }
      }
    });

    return !isError;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    var value = e.target.value;

    if (name === "username") {
      value = value.toLowerCase();
    } else if (name === "no_telp") {
      value = value.replace(/\D/g, "");
    } else if (name === "status") {
      value = value.replace(/\D/g, "");
      value = parseInt(value);
    }

    setFormData((state) => ({ ...state, [name]: value }));
    if (name === "username") {
      if (value.length < 5) {
        setFormDataError((state) => ({
          ...state,
          [name]: "doit être rempli minimal 5 karakter.",
        }));
      } else {
        setFormDataError((state) => ({ ...state, [name]: false }));
      }
    } else if (name === "email") {
      if (value === undefined || value === "") {
        setFormDataError((state) => ({ ...state, [name]: "doit être rempli." }));
      } else if (!value.includes("@") || !value.includes(".")) {
        setFormDataError((state) => ({ ...state, [name]: "tidak valid." }));
      } else {
        setFormDataError((state) => ({ ...state, [name]: false }));
      }
    } else if (name === "password") {
      if (value.length < 6) {
        setFormDataError((state) => ({
          ...state,
          [name]: "doit être rempli d'au moins 6 caractères.",
        }));
      } else {
        setFormDataError((state) => ({ ...state, [name]: false }));
      }
    } else {
      if (value === undefined || value === "") {
        setFormDataError((state) => ({ ...state, [name]: "doit être rempli" }));
      } else {
        setFormDataError((state) => ({ ...state, [name]: false }));
      }
    }
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];

    if (file.size / 1000000 > 2) {
      setSelectedFile(null);
    }
    if (
      file.type !== "image/jpeg" ||
      file.type !== "image/jpg" ||
      file.type !== "image/png"
    ) {
      setSelectedFile(null);
    }
    setSelectedFile(file);
  };

  const uploadFile = () => {
    if (!selectedFile) {
      return false;
    }

    const formData = new FormData();
    formData.set("file", selectedFile, selectedFile.name);

    return api
      .post(`/upload`, formData, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        return error.response;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var filename;
    setShowLoading(true);
    const response = await uploadFile();
    setShowLoading(false);

    if (response) {
      filename = response.data.filename;
    }

    if (!formValidation()) {
      return false;
    }

    setShowLoading(true);

    await api
      .post(
        "/pengguna",
        { ...formData, foto: filename },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }

        if (error.response.data) {
          setAlert({ message: error.response.data.message, error: true });
        } else {
          setAlert({ message: "Internal server error!", error: true });
        }

        setShowAlert(true);
      });

    setShowLoading(false);
  };

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Ajouter un utilisateur | INVENTORY</title>
      </Helmet>
      {showLoading ? (
        <div className="fixed bg-transparent w-full h-full z-30">
          <div
            className="fixed top-1/2 left-1/2 text-white transform -translate-y-1/2 -translate-x-1/2 rounded-lg px-8 py-3"
            style={{ backgroundColor: "#00000097" }}>
            <Loading>
              <div className="font-montserrat text-gray-300 mt-2">
                Chargement...
              </div>
            </Loading>
          </div>
        </div>
      ) : null}
      <Alert
        show={showAlert}
        afterClose={() => {
          setShowAlert(false);
          if (alert.error === false) {
            history.goBack();
          }
        }}>
        {alert.error ? (
          <div
            className={`bg-red-300 font-bold text-sm text-white rounded-lg px-8 py-3`}>
            {alert.message}
          </div>
        ) : (
          <div
            className={`bg-green-300 font-bold text-sm text-white rounded-lg px-8 py-3`}>
            {alert.message}
          </div>
        )}
      </Alert>

      <Card className="font-montserrat w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
        <div className="font-montserrat font-bold text-lg text-gray-500 mb-6">
          Ajouter un utilisateur
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">Foto</div>
              <input
                type="file"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                onChange={handleChangeFile}
              />
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Nom d'utilisateur <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Nom d'utilisateur"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.username ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Username ${formDataError.username}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Nom d'utilisateur <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Nom d'utilisateur"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.nama ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Nom d'utilisateur ${formDataError.nama}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Email <span className="text-red-400">*</span>
              </div>
              <input
                type="email"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.email ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Email ${formDataError.email}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Mot de passe <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.password ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Mot de passe ${formDataError.password}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                No telp <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="No telp"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.no_telp ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`No telp ${formDataError.no_telp}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Role <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.role}
                name="role"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Choix du Role --
                </option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
              <div
                className={`${
                  formDataError.role ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Role ${formDataError.role}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Status <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.status}
                name="status"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Choix du Status --
                </option>
                <option value="1">Actif</option>
                <option value="0">Inactif</option>
              </select>
              <div
                className={`${
                  formDataError.status ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Status ${formDataError.status}`}
              </div>
            </div>
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
            Sauvegarder
          </button>
        </form>
      </Card>
    </>
  );
};

export default TambahPengguna;
