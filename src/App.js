import React, { Component }  from 'react';
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./auth";

import DataBarang from "./pages/Barang/DataBarang";
import DataPengguna from "./pages/Pengguna/DataPengguna";
import DataKategori from "./pages/Kategori/DataKategori";
import DataSatuan from "./pages/Satuan/DataSatuan";

import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";

import TambahBarang from "./pages/Barang/TambahBarang";
import EditBarang from "./pages/Barang/EditBarang";
import DetailBarang from "./pages/Barang/DetailBarang";

import Container from "./components/Container";

import DataSupplier from "./pages/Supplier/DataSupplier";
import TambahSupplier from "./pages/Supplier/TambahSupplier";
import EditSupplier from "./pages/Supplier/EditSupplier";

import DataShowroom from "./pages/Showroom/DataShowroom";
import TambahShowroom from "./pages/Showroom/TambahShowroom";
import EditShowroom from "./pages/Showroom/EditShowroom";

import DataBarangMasuk from "./pages/BarangMasuk/DataBarangMasuk";
import TambahBarangMasuk from "./pages/BarangMasuk/TambahBarangMasuk";

import DataBarangKeluar from "./pages/BarangKeluar/DataBarangKeluar";
import TambahBarangKeluar from "./pages/BarangKeluar/TambahBarangKeluar";

import DataBarangTransfert from "./pages/BarangTransfert/DataBarangTransfert";
import TambahBarangTransfert from "./pages/BarangTransfert/TambahBarangTransfert";

import EditPengguna from "./pages/Pengguna/EditPengguna";
import TambahPengguna from "./pages/Pengguna/TambahPengguna";

import LaporanBarang from "./pages/Laporan/LaporanBarang";

import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route
          path="/login"
          exact
          render={(props) => {
            if (localStorage.getItem("isLoggedIn")) {
              return props.history.push("/");
            } else {
              return <LoginPage {...props} />;
            }
          }}
        />
        <Route path="/404" component={PageNotFound} />

        <Container>
          <PrivateRoute
            path="/logout"
            exact
            render={() => {
              localStorage.clear();
              return <Redirect to="/login" />;
            }}
          />
          <PrivateRoute path="/" exact component={IndexPage} />
          <PrivateRoute path="/profile" exact component={Profile} />
          <PrivateRoute path="/profile/edit" exact component={EditProfile} />

          <PrivateRoute
            path="/pengguna"
            exact
            render={(props) => {
              if (localStorage.getItem("role") !== "admin") {
                return props.history.goBack();
              } else {
                return <DataPengguna {...props} />;
              }
            }}
          />
          <PrivateRoute
            path="/pengguna/tambah"
            exact
            render={(props) => {
              if (localStorage.getItem("role") !== "admin") {
                return props.history.goBack();
              } else {
                return <TambahPengguna {...props} />;
              }
            }}
          />
          <PrivateRoute
            path="/pengguna/:id/edit"
            exact
            render={(props) => {
              if (localStorage.getItem("role") !== "admin") {
                return props.history.goBack();
              } else {
                return <EditPengguna {...props} />;
              }
            }}
          />

          <PrivateRoute path="/barang" exact component={DataBarang} />
          <PrivateRoute path="/barang/tambah" exact component={TambahBarang} />
          <PrivateRoute path="/barang/:id/edit" exact component={EditBarang} />
          <PrivateRoute path="/barang/:id/detail" exact component={DetailBarang} />

          <PrivateRoute path="/kategori" exact component={DataKategori} />
          <PrivateRoute path="/satuan" exact component={DataSatuan} />

          <PrivateRoute path="/supplier" exact component={DataSupplier} />
          <PrivateRoute
            path="/supplier/tambah"
            exact
            component={TambahSupplier}
          />
          <PrivateRoute
            path="/supplier/:id/edit"
            exact
            component={EditSupplier}
          />

          <PrivateRoute path="/showroom" exact component={DataShowroom} />
          <PrivateRoute
            path="/showroom/tambah"
            exact
            component={TambahShowroom}
          />
          <PrivateRoute
            path="/showroom/:id/edit"
            exact
            component={EditShowroom}
          />

          <PrivateRoute
            path="/barang_masuk"
            exact
            component={DataBarangMasuk}
          />
          <PrivateRoute
            path="/barang_masuk/tambah"
            exact
            component={TambahBarangMasuk}
          />

          <PrivateRoute
            path="/barang_keluar"
            exact
            component={DataBarangKeluar}
          />
          <PrivateRoute
            path="/barang_keluar/tambah"
            exact
            component={TambahBarangKeluar}
          />

          <PrivateRoute
            path="/barang_transfert"
            exact
            /*render={(props) => {
              if (localStorage.getItem("role") !== "admin") {
                return props.history.goBack();
              } else {
                return <DataBarangTransfert {...props} />;
              }
            }}*/
            component={DataBarangTransfert}
          />
          <PrivateRoute
            path="/barang_transfert/tambah"
            exact
            /*render={(props) => {
              if (localStorage.getItem("role") !== "admin") {
                return props.history.goBack();
              } else {
                return <TambahBarangTransfert {...props} />;
              }
            }}*/
            component={TambahBarangTransfert}
          />

          <PrivateRoute path="/laporan" exact component={LaporanBarang} />
        </Container>
      </Switch>
    </HashRouter>
  );
}

export default App;
