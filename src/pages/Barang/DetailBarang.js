import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../../components/elements/Button";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const DetailBarang = (props) => {
  const { id } = props.match.params;
  const [formData, setFormData] = useState({
    nama_barang: "",
    stok: "",
    harga_jual: "",
    harga_beli: "",
    id_kategori: "",
    id_showroom1: "",
    stok1: "",
    id_showroom2: "",
    stok2: "",
    id_satuan: "",
  });
  const [formDataError, setFormDataError] = useState({
    nama_barang: false,
    stok: false,
    harga_jual: false,
    harga_beli: false,
    id_kategori: false,
    id_showroom1: false,
    stok1: false,
    id_showroom2: false,
    stok2: false,
    id_satuan: false,
  });
  const [dataKategori, setDataKategori] = useState([]);
  const [datashowroom, setDatashowroom] = useState([]);
  const [dataSatuan, setDataSatuan] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const history = useHistory();

  const fetchBarang = async () => {
    await api
      .get(`/barang/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // delete response.data.data.stok1;
        // delete response.data.data.stok2;
        setFormData(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchKategori = async () => {
    await api
      .get("/kategori", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataKategori(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchshowroom = async () => {
    await api
      .get("/showroom", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDatashowroom(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchSatuan = async () => {
    await api
      .get("/satuan", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataSatuan(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const formValidation = () => {
    let isError = false;

    Object.entries(formData).forEach((data) => {
      let [name, value] = data;

      if (value === undefined || value === "") {
        isError = true;
        setFormDataError((state) => ({ ...state, [name]: "doit être rempli" }));
      }
    });

    return !isError;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    var value = e.target.value;

    // only number
    if (name === "stock" || name === "stock1" || name === "stock2" || name === "harga_jual" || name === "harga_beli") {
      value = value.replace(/\D/g, "");
      value = value === "" ? '' : parseInt(value);
    }

    setFormData((state) => ({ ...state, [name]: value }));
    if (value === undefined || value === "") {
      setFormDataError((state) => ({ ...state, [name]: "doit être rempli" }));
    } else {
      setFormDataError((state) => ({ ...state, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValidation()) {
      return false;
    }

    setShowLoading(true);

    await api
      .put(`/barang/${id}`, formData, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setAlert((state) => ({ ...state, ...response.data }));
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

    fetchKategori();
    fetchshowroom();
    fetchSatuan();
  }, []);

  useEffect(() => {
    fetchBarang();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Détails de l'article | INVENTORY</title>
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
          Détails de l'articles
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Showroom Dakar
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_showroom1}
                name="id_showroom1"
                disabled
                //onChange={handleChange}
                >
                <option value="" disabled>
                  -- Choix de Showroom --
                </option>
                {datashowroom.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_showroom}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_showroom1 ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`showroom ${formDataError.id_showroom1}`}
              </div>
              <div
                className={`${
                  formDataError.id_showroom1 ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`showroom ${formDataError.id_showroom1}`}
              </div>
            </div>
            <div className={`grid grid-cols-12 items-center gap-x-4 gap-y-1`}>
              <div className="col-span-full md:col-span-4">
                {`Stock Dakar`} 
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Stock"
                name="stok1"
                value={formData.stok1}
                disabled
                //onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.stok1 ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Stok ${formDataError.stok1}`}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Showroom St. Louis
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_showroom2}
                name="id_showroom2"
                disabled
                //onChange={handleChange}
                >
                <option value="" disabled>
                  -- Choix de Showroom --
                </option>
                {datashowroom.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_showroom}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_showroom2 ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`showroom ${formDataError.id_showroom2}`}
              </div>
            </div>
            <div className={`grid grid-cols-12 items-center gap-x-4 gap-y-1`}>
                <div className="col-span-full md:col-span-4">
                  {`Stock St. Louis`} 
                </div>
                <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Stock"
                name="stok2"
                value={formData.stok2}
                disabled
                //onChange={handleChange}
                />
                <div
                  className={`${
                    formDataError.stok2 ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Stok ${formDataError.stok2}`}
                </div>
            </div>

            <div className={`grid grid-cols-12 items-center gap-x-4 gap-y-1`}>
                <div className="col-span-full md:col-span-4">
                  {`Stock Total`} 
                </div>
                {formData.stok}
                <div
                  className={`${
                    formDataError.stok ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {`Stok ${formDataError.stok}`}
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

export default DetailBarang;
