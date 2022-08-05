import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../../components/elements/Button";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const EditShowroom = (props) => {
  const { id } = props.match.params;
  const [formData, setFormData] = useState({
    nama_showroom: "",
    no_telp: "",
    alamat: "",
    emplacement1: "",
    emplacement2: "",
    emplacement3: "",
    emplacement4: "",
    emplacement5: "",
    num_emplacement: 1
  });
  const [formDataError, setFormDataError] = useState({
    nama_showroom: false,
    no_telp: false,
    alamat: false,
    // emplacement1: false,
    // emplacement2: false,
    // emplacement3: false,
    // emplacement4: false,
    // emplacement5: false,
    // num_emplacement: false
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

      if (name === "no_telp") {
        value = value.replace(/\D/g, "");
      }

      /* if (!value) */ if (formData.nama_showroom === "" || formData.no_telp === "" || formData.alamat === "") {
        isError = true;
        setFormDataError((state) => ({ ...state, [name]: "doit être rempli" }));
      }
    });

    return !isError;
  };

  const fetchShowroom = async () => {
    setShowLoading(true);

    await api
      .get(`/showroom/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setFormData(response.data.data);
        setFormData((state) => ({ ...state, num_emplacement: 1 }));
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });

    setShowLoading(false);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    var value = e.target.value;

    // only number
    if (name === "no_telp") {
      value = value.replace(/\D/g, "");
    }

    if (value) {
      setFormData((state) => ({ ...state, [name]: value }));
      setFormDataError((state) => ({ ...state, [name]: false }));
    } else {
      setFormData((state) => ({ ...state, [name]: value }));
      setFormDataError((state) => ({ ...state, [name]: "doit être rempli" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValidation()) {
      return false;
    }

    setShowLoading(true);

    await api
      .put(`/showroom/${id}`, formData, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
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

        setAlert({ message: "Internal server error!", error: true });
        setShowAlert(true);
      });
    
    setShowLoading(false);
  };

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });

    fetchShowroom();
  }, [id]);

  return (
    <div>
      <Helmet>
        <title>Modifier le showroom | INVENTORY</title>
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
            return history.goBack();
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
          Modifier le showroom
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-4">

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Nom du showroom <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Nom du showroom"
                name="nama_showroom"
                value={formData.nama_showroom}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.nama_showroom ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Nama showroom ${formDataError.nama_showroom}`}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className={`${
                formData.emplacement1 !== "" ? "" : formData.num_emplacement >= 1 ? "" : "hidden"
              } col-span-full md:col-span-4`}>
                Emplacement {1}
              </div>
              <input
                type="text"
                className={`${
                  formData.emplacement1 !== "" ? "" : formData.num_emplacement >= 1 ? "" : "hidden"
                } col-span-full md:col-span-7 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2`}
                placeholder="Nom de l'emplacement"
                name="emplacement1"
                value={formData.emplacement1}
                onChange={handleChange}
              />
              {/* 
                <div
                  className={`${
                    formDataError.emplacement1 ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Cet emplacement ${formDataError.emplacement1}`}
                </div>
              */}
              <div className={`${
                formData.num_emplacement === 1 ? "" : "hidden"
              } col-span-full md:col-span-1`}>
                <button
                  className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-3 py-1"
                  type="button"
                  onClick={() => {
                    if(formData.emplacement1 !== "") {
                      setFormData((state) => ({ ...state, num_emplacement: 2 }));
                    }
                  }
                }>
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className={`${
                formData.emplacement2 !== "" ? "" : formData.num_emplacement >= 2 ? "" : "hidden"
              } col-span-full md:col-span-4`}>
                Emplacement {2}
              </div>
              <input
                type="text"
                className={`${
                  formData.emplacement2 !== "" ? "" : formData.num_emplacement >= 2 ? "" : "hidden"
                } col-span-full md:col-span-7 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2`}
                placeholder="Nom de l'emplacement"
                name="emplacement2"
                value={formData.emplacement2}
                onChange={handleChange}
              />
              {/* 
                <div
                  className={`${
                    formDataError.emplacement2 ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Cet emplacement ${formDataError.emplacement2}`}
                </div>
              */}
              <div className={`${
                formData.num_emplacement === 2 ? "" : "hidden"
              } col-span-full md:col-span-1`}>
                <button
                  className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-3 py-1"
                  type="button"
                  onClick={() => {
                    if(formData.emplacement2 !== "") {
                      setFormData((state) => ({ ...state, num_emplacement: 3 }));
                    }
                  }
                }>
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className={`${
                formData.emplacement3 !== "" ? "" : formData.num_emplacement >= 3 ? "" : "hidden"
              } col-span-full md:col-span-4`}>
                Emplacement {3}
              </div>
              <input
                type="text"
                className={`${
                  formData.emplacement3 !== "" ? "" : formData.num_emplacement >= 3 ? "" : "hidden"
                } col-span-full md:col-span-7 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2`}
                placeholder="Nom de l'emplacement"
                name="emplacement3"
                value={formData.emplacement3}
                onChange={handleChange}
              />
              {/* 
                <div
                  className={`${
                    formDataError.emplacement3 ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Cet emplacement ${formDataError.emplacement3}`}
                </div>
              */}
              <div className={`${
                formData.num_emplacement === 3 ? "" : "hidden"
              } col-span-full md:col-span-1`}>
                <button
                  className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-3 py-1"
                  type="button"
                  onClick={() => {
                    if(formData.emplacement3 !== "") {
                      setFormData((state) => ({ ...state, num_emplacement: 4 }));
                    }
                  }
                }>
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className={`${
                formData.emplacement4 !== "" ? "" : formData.num_emplacement >= 4 ? "" : "hidden"
              } col-span-full md:col-span-4`}>
                Emplacement {4}
              </div>
              <input
                type="text"
                className={`${
                  formData.emplacement4 !== "" ? "" : formData.num_emplacement >= 4 ? "" : "hidden"
                } col-span-full md:col-span-7 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2`}
                placeholder="Nom de l'emplacement"
                name="emplacement4"
                value={formData.emplacement4}
                onChange={handleChange}
              />
              {/* 
                <div
                  className={`${
                    formDataError.emplacement4 ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Cet emplacement ${formDataError.emplacement4}`}
                </div>
              */}
              <div className={`${
                formData.num_emplacement === 4 ? "" : "hidden"
              } col-span-full md:col-span-1`}>
                <button
                  className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-3 py-1"
                  type="button"
                  onClick={() => {
                    if(formData.emplacement4 !== "") {
                      setFormData((state) => ({ ...state, num_emplacement: 5 }));
                    }
                  }
                }>
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className={`${
                formData.emplacement5 !== "" ? "" : formData.num_emplacement >= 5 ? "" : "hidden"
              } col-span-full md:col-span-4`}>
                Emplacement {5}
              </div>
              <input
                type="text"
                className={`${
                  formData.emplacement5 !== "" ? "" : formData.num_emplacement >= 5 ? "" : "hidden"
                } col-span-full md:col-span-7 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2`}
                placeholder="Nom de l'emplacement"
                name="emplacement5"
                value={formData.emplacement5}
                onChange={handleChange}
              />
              {/* 
                <div
                  className={`${
                    formDataError.emplacement5 ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Cet emplacement ${formDataError.emplacement5}`}
                </div>
              */}
              {/*
              <div className={`${
                formData.num_emplacement === 5 ? "" : "hidden"
              } col-span-full md:col-span-1`}>
                <button
                  className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-3 py-1"
                  type="button"
                  onClick={() => {
                    if(formData.emplacement5 !== "") {
                      setFormData((state) => ({ ...state, num_emplacement: 6 }));
                    }
                  }
                }>
                  +
                </button>
              </div>
              */}
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

            <div className="grid grid-cols-12 items-start gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Adresse <span className="text-red-400">*</span>
              </div>
              <textarea
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Adresse"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}></textarea>
              <div
                className={`${
                  formDataError.alamat ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Adresse ${formDataError.alamat}`}
              </div>
            </div>

          </div>
          
          <button 
            className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6"
            type="submit" // It is the default parameter; I did not have to specify that it trigger the form submission
            >
            Sauvegarder
          </button>
        </form>
      </Card>
    </div>
  );
};

export default EditShowroom;
