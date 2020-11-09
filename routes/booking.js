const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controler');
const db = require('../config/db.config');

// define variable
const sequelize = db.sequelize;
const Users = db.users;

router.post('/', bookingController.create);
router.post('/create-booking-customer', bookingController.createBookingCustomer);
router.post('/edit-booking-customer/:id', bookingController.EditBookingCustomer);
router.get('/', bookingController.findAll);
router.get('/find-machine-booking', bookingController.findMachineBooking);
router.get('/find-booking', bookingController.findAllBookingSearch);
router.get('/find-booking-customer/:cus_id', bookingController.findBookingCustomer);
router.get('/:id', bookingController.findOne);
router.put('/:id', bookingController.update);
router.put('/:id', bookingController.cancel_booking);
router.put('/cancel-booking-customer/:id', bookingController.cancel_booking_customer);
router.delete('/:id', bookingController.delete);
module.exports = router;