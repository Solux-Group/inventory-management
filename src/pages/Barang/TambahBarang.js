import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import { useHistory } from "react-router";

const TambahBarang = () => {
  const [formData, setFormData] = useState({
    nama_barang: "",
    stok: "",
    harga_jual: "",
    harga_beli: "",
    id_kategori: "",
    id_showroom: "",
    nama_showroom: "",
    id_satuan: "",
  });
  const [formDataError, setFormDataError] = useState({
    nama_barang: false,
    stok: false,
    harga_jual: false,
    harga_beli: false,
    id_kategori: false,
    id_showroom: false,
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

  const fetchKategori = async () => {
    await api
      .get("/kategori", {
        headers: { "x-access-token": localStorage.getItem("token") },
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
        headers: { "x-access-token": localStorage.getItem("token") },
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
        headers: { "x-access-token": localStorage.getItem("token") },
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
        setFormDataError((state) => ({ ...state, [name]: "Doit être rempli" }));
      }
    });

    return !isError;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    var value = e.target.value;

    // only number
    if (name === "stok" || name === "harga_jual" || name === "harga_beli") {
      value = value.replace(/\D/g, "");
      value = value === "" ? '' : parseInt(value);
    }

    setFormData((state) => ({ ...state, [name]: value }));
    if (value === undefined || value === "") {
      setFormDataError((state) => ({ ...state, [name]: "Doit être rempli" }));
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
      .post("/barang", formData, {
        headers: { "x-access-token": localStorage.getItem("token") },
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

    fetchKategori();
    fetchshowroom();
    fetchSatuan();
  }, []);

  return (
    <>
      <Helmet>
        <title>Ajouter un article | INVENTORY</title>
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
          Ajouter un article
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Nom des marchandises <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Nom des marchandises"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.nama_barang ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Nom de l'article ${formDataError.nama_barang}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Showroom <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_showroom}
                name="id_showroom"
                onChange={handleChange}>
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
                  formDataError.id_showroom ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`showroom ${formDataError.id_showroom}`}
              </div>
            </div>
            <div className={`${formData.id_showroom ? "" : "hidden"} grid grid-cols-12 items-center gap-x-4 gap-y-1`}>
              <div className="col-span-full md:col-span-4">
                {`Stoque ${formData.nama_showroom}`}  <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                className="col-span-full md:col-span-8 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                placeholder="Stoque"
                name="stok"
                value={formData.stok}
                onChange={handleChange}
              />
              <div
                className={`${
                  formDataError.stok ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Stok ${formDataError.stok}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Prix ​​de vente <span className="text-red-400">*</span>
              </div>
              <div className="flex col-span-full md:col-span-8 border border-gray-300 rounded-md focus-within:ring focus-within:ring-indigo-200">
                <div className="bg-gray-100  px-3 py-2">CFA</div>
                <input
                  type="text"
                  className="focus:outline-none w-full p-2"
                  placeholder="Prix ​​de vente"
                  name="harga_jual"
                  value={formData.harga_jual}
                  onChange={handleChange}
                />
              </div>
              <div
                className={`${
                  formDataError.harga_jual ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Harga jual ${formDataError.harga_jual}`}
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
                  className="focus:outline-none w-full p-2"
                  placeholder="Prix ​​d'achat"
                  name="harga_beli"
                  value={formData.harga_beli}
                  onChange={handleChange}
                />
              </div>
              <div
                className={`${
                  formDataError.harga_beli ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Harga beli ${formDataError.harga_beli}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Catégorie <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_kategori}
                name="id_kategori"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Choix de Catégorie --
                </option>
                {dataKategori.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_kategori}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_kategori ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Kategori ${formDataError.id_kategori}`}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1">
              <div className="col-span-full md:col-span-4">
                Unité <span className="text-red-400">*</span>
              </div>
              <select
                className="col-span-full md:col-span-8 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                value={formData.id_satuan}
                name="id_satuan"
                onChange={handleChange}>
                <option value="" disabled>
                  -- Choix d'Unité --
                </option>
                {dataSatuan.map((value, index) => {
                  return (
                    <option value={value._id} key={index}>
                      {value.nama_satuan}
                    </option>
                  );
                })}
              </select>
              <div
                className={`${
                  formDataError.id_satuan ? "" : "hidden"
                } md:col-start-5 col-span-full text-sm text-red-400`}>
                {`Satuan ${formDataError.id_satuan}`}
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

export default TambahBarang;
