import React, { Component }  from 'react';
import api from "../../config/api";
import { useEffect, useState } from "react";
import Card from "../../components/elements/Card";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Modal from "../../components/elements/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";
import Alert from "../../components/elements/Alert";
import Loading from "../../components/elements/Loading";
import Datatable from "../../components/Datatable";
import moment from "moment";
import { CSVLink } from "react-csv";

const Tr = styled.tr`
  :nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const DataBarangMasuk = () => {
  const initialStateFormDataDeleteBarangMasuk = { no_transaksi: "" };
  const [dataBarangMasuk, setDataBarangMasuk] = useState(null);
  const columns = [
    { label: "No", field: "created_at", disabled: true },
    { label: "No Transaction", field: "no_transaksi" },
    { label: "Fournisseurs", field: "nama_supplier", disabled: true },
    { label: "Nom des marchandises", field: "nama_barang", disabled: true },
    { label: "Showrooms", field: "nama_showroom", disabled: true },
    { label: "Quantité", field: "kuantitas" },
    { label: "Prix ​​d'achat", field: "harga_beli", disabled: true },
    { label: "Prix ​​total", field: "total_harga", disabled: true },
    { label: "Utilisateur", field: "username", disabled: true },
    { label: "Date d'enregistrement", field: "created_at" },
    { label: "Action", field: "aksi", disabled: true },
  ];
  const headersCSV = [
    { label: "No Transaction", key: "no_transaksi" },
    { label: "Fournisseurs", key: "supplier" },
    { label: "Nom des marchandises", key: "nama_barang" },
    { label: "Showrooms", key: "showroom" },
    { label: "Quantité", key: "kuantitas" },
    { label: "Prix ​​d'achat", key: "harga_beli" },
    { label: "Prix ​​total", key: "total_harga" },
    { label: "Utilisateur", key: "username" },
    { label: "Date d'enregistrement", key: "created_at" },
  ];
  const [dataCSV, setDataCSV] = useState([]);
  const [sortBy, setSortBy] = useState({
    field: "no_transaksi",
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
  const [showModalDeleteBarangMasuk, setShowModalDeleteBarangMasuk] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    error: false,
  });
  const [formDataDeleteBarangMasuk, setFormDataDeleteBarangMasuk] = useState(
    initialStateFormDataDeleteBarangMasuk
  );
  const history = useHistory();

  const fetchBarangMasuk = async () => {
    setShowLoading(true);

    await api
      .get("/barang_masuk", {
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
        setDataBarangMasuk(response.data);
        setDataCSV(() => {
          const data = [];
          response.data.data.forEach((value, index) => {
            data.push({
              no_transaksi: value.no_transaksi,
              supplier: value.id_supplier
                ? value.id_supplier.nama_supplier
                : null,
              nama_barang: value.barang_masuk
                ? value.barang_masuk.nama_barang
                : null,
              showroom: value.id_showroom
              ? value.id_showroom.nama_showroom
              : null,
              kuantitas: value.kuantitas,
              harga_beli: value.harga_beli,
              total_harga: value.harga_beli * value.kuantitas,
              username: value.user_input ? value.user_input.nama : null,
              created_at: moment(value.created_at).format("YYYY MM DD"),
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

  const handleSubmitDeleteBarangMasuk = async () => {
    setShowLoading(true);

    await api
      .delete(`/barang_masuk/${formDataDeleteBarangMasuk.no_transaksi}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        fetchBarangMasuk();
        setAlert({ message: response.data.message, error: false });
        setShowAlert(true); // show alert
        setShowModalDeleteBarangMasuk(false); // hide modal
        setFormDataDeleteBarangMasuk(initialStateFormDataDeleteBarangMasuk); // reset form
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
    if (!dataBarangMasuk || dataBarangMasuk.data.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan={columns.length}>Données vides</td>
        </tr>
      );
    }

    return dataBarangMasuk.data.map((value, index) => {
      const no = (dataTable.page - 1) * dataTable.rowsPerPage;
      return (
        <Tr key={index}>
          <td className="border text-center">{no + (index + 1)}</td>
          <td className="border text-center font-lato">{value.no_transaksi}</td>
          <td className="border">
            {value.id_supplier ? value.id_supplier.nama_supplier : "-"}
          </td>
          <td className="border">
            {value.barang_masuk ? value.barang_masuk.nama_barang : "-"}
          </td>
          <td className="border">
            {value.id_showroom ? value.id_showroom.nama_showroom : "-"}
          </td>
          <td className="border text-center">{value.kuantitas}</td>
          <td className="border text-right">{`CFA ${value.harga_beli.toLocaleString(
            { style: "currency", currency: "CFA" }
          )}/${
            value.barang_masuk ? value.barang_masuk.id_satuan.nama_satuan : "-"
          }`}</td>
          <td className="border text-right">{`CFA ${(
            value.harga_beli * value.kuantitas
          ).toLocaleString({ style: "currency", currency: "CFA" })}`}</td>
          <td className="border text-center">
            {value.user_input ? value.user_input.nama : "-"}
          </td>
          <td className="border text-center">
            {moment(value.created_at).format("YYYY-MM-DD")}
          </td>
          <td className="border">
            <div className="flex items-center justify-center text-xs space-x-1">
              <button
                className="border border-red-300 bg-red-50 hover:bg-red-200 text-red-600 rounded-full focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
                onClick={() => {
                  setShowModalDeleteBarangMasuk(true);
                  setFormDataDeleteBarangMasuk({
                    no_transaksi: value.no_transaksi,
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
    fetchBarangMasuk();
  }, [dataTable.q, dataTable.rowsPerPage, dataTable.page, sortBy]);

  return (
    <>
      <Helmet>
        <title>Éléments de connexion | INVENTORY</title>
      </Helmet>
      {showLoading ? (
        <div className="fixed bg-transparent w-full h-full z-30">
          <div
            className="fixed top-1/2 left-1/2 text-white transform -translate-y-1/2 -translate-x-1/2 rounded-lg px-8 py-3"
            style={{ backgroundColor: "#00000097" }}>
            <Loading>
              <div className="font-montserrat text-gray-300 mt-2">
                Loading...
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
        show={showModalDeleteBarangMasuk}
        afterClose={() => setShowModalDeleteBarangMasuk(false)}>
        <Card className="font-montserrat">
          <div className="flex items-start justify-between mb-4">
            <div className="font-bold text-gray-500 text-lg border-b pb-2">
              Supprimer la transaction d'article entrant
            </div>
            <button
              onClick={() => {
                setShowModalDeleteBarangMasuk(false);
              }}>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-300 text-sm"
              />
            </button>
          </div>
          <div className="text-sm">
            Êtes-vous sûr de vouloir supprimer les transactions ?{" "}
            <strong className="font-lato">
              {formDataDeleteBarangMasuk.no_transaksi}
            </strong>
            ?
          </div>
          <div className="flex justify-between text-sm space-x-2 mt-8">
            <button
              className="bg-red-500 hover:bg-red-400 text-red-100 rounded focus:ring focus:ring-red-100 focus:outline-none px-4 py-1.5"
              onClick={() => {
                setShowModalDeleteBarangMasuk(false);
              }}>
              Annuler
            </button>
            <button
              className="bg-green-500 hover:bg-green-400 text-green-100 rounded focus:ring focus:ring-green-100 focus:outline-none px-4 py-1.5"
              onClick={handleSubmitDeleteBarangMasuk}>
              Oui
            </button>
          </div>
        </Card>
      </Modal>

      <Card className="font-montserrat">
        <div className="font-bold text-gray-500 text-xl mb-6">
          Éléments de connexion
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 mr-2 mb-4"
          onClick={() => {
            history.push("/barang_masuk/tambah");
          }}>
          Ajouter un article Connexion
        </button>

        <CSVLink
          className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5 ml-2"
          headers={headersCSV}
          data={dataCSV}
          filename="Solux_Donnée_Marchandises_Entrantes.csv"
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

export default DataBarangMasuk;
