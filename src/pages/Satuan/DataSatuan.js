import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import styled from "styled-components";
import Modal from "../../components/elements/Modal";
import { Button, ButtonLight } from "../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import Datatable from "../../components/Datatable";
import { useHistory } from "react-router";
import { CSVLink } from "react-csv";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataSatuan = () => {
  const initialStateFormDataAddSatuan = { nama_satuan: "" };
  const initialStateFormDataEditSatuan = { _id: "", nama_satuan: "" };
  const initialStateFormDataDeleteSatuan = { _id: "", nama_satuan: "" };
  const [dataSatuan, setDataSatuan] = useState(null);
  const columns = [
    { label: "No", field: "_id" },
    { label: "Nom de l'unité", field: "nama_satuan" },
    { label: "Action", field: "aksi", disabled: true },
  ];
  const headersCSV = [{ label: "Satuan", key: "nama_satuan" }];
  const [dataCSV, setDataCSV] = useState([]);
  const [sortBy, setSortBy] = useState({
    field: "_id",
    direction: "desc",
  });
  const [dataTable, setDataTable] = useState({
    q: "",
    page: 1,
    rowsPerPage: 10,
    totalPages: 0,
    totalRows: 0,
    totalPagesFiltered: 0,
    totalRowsFiltered: 0,
  });
  const [showModalAddSatuan, setShowModalAddSatuan] = useState(false);
  const [showModalEditSatuan, setShowModalEditSatuan] = useState(false);
  const [showModalDeleteSatuan, setShowModalDeleteSatuan] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const [formDataAddSatuan, setFormDataAddSatuan] = useState(
    initialStateFormDataAddSatuan
  );
  const [formDataEditSatuan, setFormDataEditSatuan] = useState(
    initialStateFormDataEditSatuan
  );
  const [formDataDeleteSatuan, setFormDataDeleteSatuan] = useState(
    initialStateFormDataDeleteSatuan
  );
  const [formDataAddSatuanError, setFormDataAddSatuanError] = useState(false);
  const [formDataEditSatuanError, setFormDataEditSatuanError] = useState(false);
  const history = useHistory();

  const fetchSatuan = async () => {
    setShowLoading(true);

    await api
      .get("/satuan", {
        params: {
          q: dataTable.q,
          page: dataTable.page,
          rows: dataTable.rowsPerPage,
          sortby: `${sortBy.field}.${sortBy.direction}`,
        },
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDataSatuan(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              nama_satuan: value.nama_satuan,
            });
          });
          return data;
        });
        setDataTable((state) => ({
          ...state,
          totalPages: Math.ceil(
            parseInt(response.data.total_rows) / state.rowsPerPage
          ),
          totalRows: parseInt(response.data.total_rows),
          totalPagesFiltered: Math.ceil(
            parseInt(response.data.total_rows_filtered) / state.rowsPerPage
          ),
          totalRowsFiltered: parseInt(response.data.total_rows_filtered),
        }));
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

  const handleSubmitAddSatuan = async (e) => {
    e.preventDefault();

    if (!formDataAddSatuan.nama_satuan) {
      setFormDataAddSatuanError("Nama satuan doit être rempli.");
      return false;
    }

    setShowLoading(true);

    await api
      .post("/satuan", formDataAddSatuan, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchSatuan();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalAddSatuan(false); // hide modal
        setFormDataAddSatuan(initialStateFormDataAddSatuan); // reset form
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

  const handleSubmitEditSatuan = async (e) => {
    e.preventDefault();

    if (!formDataEditSatuan.nama_satuan) {
      setFormDataEditSatuanError("Nama satuan doit être rempli.");
      return false;
    }

    setShowLoading(true);

    await api
      .put(
        `/satuan/${formDataEditSatuan._id}`,
        { nama_satuan: formDataEditSatuan.nama_satuan },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        fetchSatuan();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalEditSatuan(false); // hide modal
        setFormDataEditSatuan(initialStateFormDataEditSatuan); // reset form
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

  const handleSubmitDeleteSatuan = async () => {
    setShowLoading(true);

    await api
      .delete(`/satuan/${formDataDeleteSatuan._id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchSatuan();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalDeleteSatuan(false); // hide modal
        setFormDataDeleteSatuan(initialStateFormDataDeleteSatuan); // reset form
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

  const DataRows = () => {
    if (!dataSatuan || dataSatuan.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Données vides</td>
        </tr>
      );
    }

    return dataSatuan.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border">{value.nama_satuan}</td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <button
                className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  setShowModalEditSatuan(true);
                  setFormDataEditSatuan({
                    _id: value._id,
                    nama_satuan: value.nama_satuan,
                  });
                }}>
                Modifier
              </button>
              <button
                className="border border-red-300 bg-red-50 hover:bg-red-200 text-red-600 rounded-full focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  setShowModalDeleteSatuan(true);
                  setFormDataDeleteSatuan({
                    _id: value._id,
                    nama_satuan: value.nama_satuan,
                  });
                }}>
                Annuler
              </button>
            </div>
          </td>
        </Tr>
      );
    });
  };

  useEffect(() => {
    fetchSatuan();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Données d'unité | INVENTORY</title>
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

      <Modal
        show={showModalAddSatuan}
        afterClose={() => {
          setShowModalAddSatuan(false);
        }}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-6">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Ajouter une unité
            </div>
            <button
              onClick={() => {
                setShowModalAddSatuan(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <form onSubmit={handleSubmitAddSatuan}>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="">
                  Nom de l'unité <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Nom de l'unité"
                  value={formDataAddSatuan.nama_satuan}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormDataAddSatuan((state) => ({
                      ...state,
                      nama_satuan: e.target.value,
                    }));
                    if (value) {
                      setFormDataAddSatuanError(false);
                    } else {
                      setFormDataAddSatuanError("Nama satuan doit être rempli.");
                    }
                  }}
                />
                <div
                  className={`${
                    formDataAddSatuanError ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {formDataAddSatuanError}
                </div>
              </div>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
              Sauvegarder
            </button>
          </form>
        </Card>
      </Modal>
      <Modal
        show={showModalEditSatuan}
        afterClose={() => {
          setShowModalEditSatuan(false);
        }}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-6">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Modifier l'unité
            </div>
            <button
              onClick={() => {
                setShowModalEditSatuan(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <form onSubmit={handleSubmitEditSatuan}>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="">
                  ID de l'unité <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  value={formDataEditSatuan._id}
                  disabled
                />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="">
                  Nom de l'unité <span className="text-red-400">*</span>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                  placeholder="Nom de l'unité"
                  value={formDataEditSatuan.nama_satuan}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormDataEditSatuan((state) => ({
                      ...state,
                      nama_satuan: e.target.value,
                    }));
                    if (value) {
                      setFormDataEditSatuanError(false);
                    } else {
                      setFormDataEditSatuanError("Le nom de l'unité est requis.");
                    }
                  }}
                />
                <div
                  className={`${
                    formDataEditSatuanError ? "" : "hidden"
                  } md:col-start-5 col-span-full text-sm text-red-400`}>
                  {formDataEditSatuanError}
                </div>
              </div>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none w-full px-4 py-1.5 mt-6">
              Sauvegarder
            </button>
          </form>
        </Card>
      </Modal>
      <Modal
        show={showModalDeleteSatuan}
        afterClose={() => setShowModalDeleteSatuan(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Supprimer l'unité
            </div>
            <button
              onClick={() => {
                setShowModalDeleteSatuan(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <div className="text-sm">
            Êtes-vous sûr de vouloir supprimer des unités{" "}
            <strong>{formDataDeleteSatuan.nama_satuan}</strong>?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <button
              className="bg-red-500 hover:bg-red-400 text-red-100 rounded focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
              onClick={() => {
                setShowModalDeleteSatuan(false);
              }}>
              Annuler
            </button>
            <button
              className="bg-green-500 hover:bg-green-400 text-green-100 rounded focus:ring focus:ring-green-100 focus:outline-none px-4 py-1.5"
              onClick={handleSubmitDeleteSatuan}>
              Oui
            </button>
          </div>
        </Card>
      </Modal>

      <Card className="font-montserrat">
        <div className="font-bold text-gray-500 text-xl mb-6">
          Données d'unité d'article
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 mr-2 mb-4"
          onClick={() => {
            setShowModalAddSatuan(true);
          }}>
          Ajouter une unité
        </button>

        <CSVLink
          className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 ml-2"
          headers={headersCSV}
          data={dataCSV}
          filename="Data_Satuan_INVENTORY.csv"
          target="_blank">
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          Exporter
        </CSVLink>

        <Datatable
          page={dataTable.page}
          rowsPerPage={dataTable.rowsPerPage}
          totalPages={dataTable.totalPages}
          totalRows={dataTable.totalRows}
          totalPagesFiltered={dataTable.totalPagesFiltered}
          totalRowsFiltered={dataTable.totalRowsFiltered}
          columns={columns}
          rows={DataRows}
          sortBy={sortBy}
          searchOnChange={(value) =>
            setDataTable((state) => ({
              ...state,
              q: value,
              page: 1,
            }))
          }
          pageOnChange={(value) =>
            setDataTable((state) => ({ ...state, page: value }))
          }
          rowsOnChange={(value) =>
            setDataTable((state) => ({
              ...state,
              page: 1,
              rowsPerPage: value,
            }))
          }
          sortByOnChange={(value) => setSortBy(value)}
        />
      </Card>
    </>
  );
};

export default DataSatuan;
