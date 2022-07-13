import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
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
import { CSVLink } from "react-csv";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataShowroom = () => {
  const initialStateFormDataDeleteShowroom = { _id: "", nama_showroom: "" };
  const [dataShowroom, setDataShowroom] = useState(null);
  const columns = [
    { label: "No", field: "_id" },
    { label: "Nom du showroom", field: "nama_showroom" },
    { label: "No telp", field: "no_telp" },
    { label: "Adresse", field: "alamat" },
    { label: "Action", field: "aksi", disabled: true },
  ];
  const headersCSV = [
    { label: "Showrooms", key: "nama_showroom" },
    { label: "No telp", key: "no_telp" },
    { label: "Adresse", key: "alamat" },
  ];
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
  const [showModalDeleteShowroom, setShowModalDeleteShowroom] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const [formDataDeleteShowroom, setFormDataDeleteShowroom] = useState(
    initialStateFormDataDeleteShowroom
  );
  const history = useHistory();

  const fetchShowroom = async () => {
    setShowLoading(true);

    await api
      .get("/showroom", {
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
        setDataShowroom(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              nama_showroom: value.nama_showroom,
              no_telp: `'${value.no_telp}`,
              alamat: value.alamat,
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

  const handleSubmitDeleteShowroom = async () => {
    setShowLoading(true);

    await api
      .delete(`/showroom/${formDataDeleteShowroom._id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchShowroom();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalDeleteShowroom(false); // hide modal
        setFormDataDeleteShowroom(initialStateFormDataDeleteShowroom); // reset form
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
    if (!dataShowroom || dataShowroom.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Données vides</td>
        </tr>
      );
    }

    return dataShowroom.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border">{value.nama_showroom}</td>
          <td className="border text-center">{value.no_telp}</td>
          <td className="border">{value.alamat}</td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <button
                className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  history.push(`/showroom/${value._id}/edit`);
                }}>
                Modifier
              </button>
              <button
                className="border border-red-300 bg-red-50 hover:bg-red-200 text-red-600 rounded-full focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  setShowModalDeleteShowroom(true);
                  setFormDataDeleteShowroom({
                    _id: value._id,
                    nama_showroom: value.nama_showroom,
                  });
                }}>
                Effacer
              </button>
            </div>
          </td>
        </Tr>
      );
    });
  };

  useEffect(() => {
    fetchShowroom();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Données Showroom | INVENTORY</title>
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
        show={showModalDeleteShowroom}
        afterClose={() => setShowModalDeleteShowroom(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Supprimer le showroom
            </div>
            <button
              onClick={() => {
                setShowModalDeleteShowroom(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <div className="text-sm">
            Êtes-vous sûr de vouloir supprimer un showroom{" "}
            <strong>{formDataDeleteShowroom.nama_showroom}</strong>?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <button
              className="bg-red-500 hover:bg-red-400 text-red-100 rounded focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
              onClick={() => {
                setShowModalDeleteShowroom(false);
              }}>
              Annuler
            </button>
            <button
              className="bg-green-500 hover:bg-green-400 text-green-100 rounded focus:ring focus:ring-green-100 focus:outline-none px-4 py-1.5"
              onClick={handleSubmitDeleteShowroom}>
              Oui
            </button>
          </div>
        </Card>
      </Modal>

      <Card className="font-montserrat">
        <div className="font-bold text-gray-500 text-xl mb-6">
          Données showroom
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 mr-2 mb-4"
          onClick={() => {
            history.push("/showroom/tambah");
          }}>
          Ajouter un showroom
        </button>

        <CSVLink
          className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 ml-2"
          headers={headersCSV}
          data={dataCSV}
          filename="Data_Showroom_INVENTORY.csv"
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

export default DataShowroom;
