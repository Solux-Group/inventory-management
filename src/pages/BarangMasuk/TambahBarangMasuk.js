import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";

const TambahBarangMasuk = () => {
  const [formData, setFormData] = useState({
    id_supplier: "",
    id_showroom: "",
    kode_barang: "",
    kuantitas: "",
    harga_beli: "",
    username: localStorage.getItem("username"),
  });
  const [formDataError, setFormDataError] = useState({
    id_supplier: false,
    id_showroom: false,
    kode_barang: false,
    kuantitas: false,
    harga_beli: false,
  });
  const [dataBarang, setDataBarang] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [dataShowroom, setDataShowroom] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const history = useHistory();

  const fetchBarang = async () => {
    await api
      .get("/barang", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataBarang(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };

  const fetchSupplier = async () => {
    await api
      .get("/supplier", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataSupplier(response.data.data);
      })
      .catch((error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          return history.push("/login");
        }
      });
  };
  
  const fetchShowroom = async () => {
    await api
      .get("/showroom", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataShowroom(response.data.data);
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
    if (name === "kuantitas") {
      value = value.replace(/\D/g, "");
      value = value === "" ? "" : parseInt(value);
    }

    if (value === undefined || value === "") {
      setFormData((state) => ({ ...state, [name]: value }));
      setFormDataError((state) => ({ ...state, [name]: "doit être rempli" }));
    } else {
      if (name === "kode_barang") {
        const { harga_beli } = dataBarang.find(
          (barang) => barang.kode_barang === value
        );
        setFormData((state) => ({
          ...state,
          [name]: value,
          harga_beli: harga_beli,
        }));
      } else {
        setFormData((state) => ({ ...state, [name]: value }));
      }
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
      .post("/barang_masuk", formData, {
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

    fetchBarang();
    fetchSupplier();
    fetchShowroom();
  }, []);

  return (
    <>
      <Helmet>
        <title>Ajouter un article Connexion | INVENTORY</title>
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
          Ajouter un article Connexion
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Fournisseur <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_supplier}
                name="id_supplier"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Choix du Fournisseur --
                </option>
                {dataSupplier.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_supplier}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_supplier ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Fournisseurs ${formDataError.id_supplier}`}
              </div>
            </div>
            
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Marchandises entrantes <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.kode_barang}
                name="kode_barang"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Choix de l'article --
                </option>
                {dataBarang.map((value, index) => {
                  return (
                    <option value={value.kode_barang} key={index}>
                      {`${value.kode_barang} | ${value.nama_barang}`}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.kode_barang ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Barang ${formDataError.kode_barang}`}
              </div>
            </div>

            <div className={"grid grid-cols-12 items-center gap-x-4 gap-y-1"}>
              <div className="col-span-full md:col-span-4">
                Showroom {formData.nama_showroom} <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_showroom}
                name="id_showroom"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Choix de Showroom --
                </option>
                {dataShowroom.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_showroom}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_showroom ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`showroom ${formDataError.id_showroom}`}
              </div>
            </div>

            <div className={`${
              formData.id_showroom ? "" : "hidden"
            } grid grid-cols-12 items-center gap-x-4 gap-y-1`}>
              <div className="col-span-full md:col-span-4">
                Quantité <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Quantité"
                name="kuantitas"
                value={formData.kuantitas}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.kuantitas ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Quantité ${formDataError.kuantitas}`}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Prix ​​d'achat <span className="text-red-400">*</span>
              </div>
              <div className="flex col-span-full md:col-span-8 border border-gray-300 rounded-md focus-within:ring focus-within:ring-indigo-200">
                <div className="bg-gray-100  px-3 py-2">CFA</div>
                <input
                  type="text"
                  className="bg-gray-50 focus:outline-none w-full p-2"
                  placeholder="Prix ​​d'achat"
                  name="harga_beli"
                  value={formData.harga_beli}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Prix ​​total <span className="text-red-400">*</span>
              </div>
              <div className="flex col-span-full md:col-span-8 border border-gray-300 rounded-md focus-within:ring focus-within:ring-indigo-200">
                <div className="bg-gray-100  px-3 py-2">CFA</div>
                <input
                  type="text"
                  className="bg-gray-50 focus:outline-none w-full p-2"
                  placeholder="Prix ​​total"
                  name="total_harga"
                  value={formData.harga_beli * formData.kuantitas}
                  onChange={handleChange}
                  readOnly
                />
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

export default TambahBarangMasuk;
