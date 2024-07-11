const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate")
const {addMainMenu, modifyMainMenu, reorderMainMenu, deleteMainMenu, ViewMainMenu, addSideMenu,
    modifySideMenu, reorderSideMenu, deleteSideMenu, ViewSideMenu} = require('../Controllers/MenuControllers')


// ===================== Main Menu API =======================

// add main menu 
router.post('/add-main-menu', Authenticate, addMainMenu);

// modify main menu
router.put("/modify-main-menu", Authenticate, modifyMainMenu); 

// reorder main menu
router.patch("/reorder-main-menu", Authenticate, reorderMainMenu); 

// delete main menu
router.delete("/delete-main-menu", Authenticate, deleteMainMenu); 

// fetch main menu
router.get("/fetch-main-menu", ViewMainMenu); 






// ===================== Side Menu API =======================

// add main menu 
router.post('/add-side-menu', Authenticate, addSideMenu);

// modify main menu
router.put("/modify-side-menu", Authenticate, modifySideMenu); 

// reorder main menu
router.patch("/reorder-side-menu", Authenticate, reorderSideMenu); 

// delete main menu
router.delete("/delete-side-menu", Authenticate, deleteSideMenu); 

// fetch main menu
router.get("/fetch-side-menu", ViewSideMenu); 



module.exports = router;