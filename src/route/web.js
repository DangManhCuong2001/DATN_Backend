import express from "express";
import { getHomepage } from "../controllers/HomeController";
import homecontroller from "../controllers/HomeController";
// import passport from "passport";
import UsersController from "../controllers/UsersController";
import DoctorsController from "../controllers/DoctorsController";
import SpecialtyController from "../controllers/SpecialtyController";
import HospitalController from "../controllers/HospitalController";
import PatientController from "../controllers/PatientController";
import HospitalSpecialtyDoctor from "../controllers/hospital-specialty-doctorController";

let router = express.Router();

let initWebRoutes = (app) => {
  //   router.get("/", getHomepage);
  router.get("/", homecontroller.getHomepage);
  router.post("/api/login", UsersController.handeLogin);

  router.get("/api/get-users", UsersController.handleGetUsers);
  router.post("/api/create-new-user", UsersController.handleCreateNewUser);
  router.put("/api/edit-user", UsersController.handleEditUser);
  router.delete("/api/delete-user", UsersController.handleDeleteUser);

  router.get("/api/allcode", UsersController.handleGetAllCode);

  //DOctor
  router.get("/api/get-all-doctors", DoctorsController.handleGetAllDoctors);

  router.post("/api/save-info-doctor", DoctorsController.handleSaveInfoDoctors);
  router.get("/api/get-info-doctor", DoctorsController.handleGetInfoDoctors);
  router.get(
    "/api/get-list-doctor-by-hospital",
    DoctorsController.handleListDoctorByHospital
  );
  //Specialty
  router.get(
    "/api/get-all-specialty",
    SpecialtyController.handleGetAllSpecialty
  );
  router.post(
    "/api/create-new-specialty",
    SpecialtyController.handleCreateNewSpecialty
  );

  //Hospital
  router.post(
    "/api/create-new-hospital",
    HospitalController.handleCreateNewHospital
  );
  router.put("/api/edit-hospital", HospitalController.handleEditHospital);
  router.get(
    "/api/get-top-hospital-home",
    HospitalController.handleGetTopHospital
  );
  router.get("/api/get-all-hospital", HospitalController.handleGetAllHospital);
  router.get(
    "/api/get-info-hospital-by-id",
    HospitalController.handleGetInfoHospitalById
  );

  router.get("/api/get-test", HospitalSpecialtyDoctor.handleGetTest);
  router.get(
    "/api/get-hospital-with-type",
    HospitalController.handleGetHospitalWithType
  );

  //Schedule
  router.post(
    "/api/bulk-create-schedule",
    DoctorsController.handleBulkCreateSchedule
  );
  router.get(
    "/api/get-schedule-doctors",
    DoctorsController.handleGetScheduleDoctors
  );

  router.post(
    "/api/patient-book-appointment",
    PatientController.handleBookAppointment
  );
  router.get(
    "/api/get-list-patient-doctor",
    PatientController.handleGetListPatientForDoctor
  );

  // router.get(
  //   "/auth/google",
  //   passport.authenticate("google", { scope: ["profile"] })
  // );

  // router.get(
  //   "google/redirect",
  //   passport.authenticate("google", { failureRedirect: "/login" }),
  //   function (req, res) {
  //     // Successful authentication, redirect home.
  //     res.redirect("/");
  //   }
  // );
  return app.use("/", router);
};

module.exports = initWebRoutes;