
const CoWork = require("../models/CoWork");
const Reservation = require('../models/Reservation.js');

//@desc     Get all coworks
//@route    GET /api/v1/coworks
//@access  Public
exports.getCoworks = async (req, res, next) => {
    try {
        let query;

        //Copy req.query
        const reqQuery = { ...req.query };

        //Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        //Loop over remove fields and deletе them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        console.log(reqQuery);

        //create query string
        let queryStr = JSON.stringify(req.query);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        //finding resource
        query = CoWork.find(JSON.parse(queryStr)).populate('reservations');


        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await CoWork.countDocuments();

        query = query.skip(startIndex).limit(limit);

        const coworks = await query;

        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }


        res.status(200).json({
            success: true,
            count: coworks.length,
            data: coworks
        });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }

};

//@desc     Get single cowork
//@route    GET /api/v1/coworks/:id
//@access   Public
exports.getCowork = async (req, res, next) => {

    const cowork = await CoWork.findById(req.params.id);

    try {

        if (!cowork) {
            return res.status(400).json({ success: false });
        }


        res.status(200).json({ success: true, data: cowork });
    }

    catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc     Create new cowork
//@route    POST /api/v1/coworks
//@access   Private
exports.createCowork = async (req, res, next) => {
    const cowork = await CoWork.create(req.body);
    res.status(201).json({ success: true, data: cowork });

};

//@desc     Update cowork
//@route    PUT /api/v1/coworks/:id
//@access   Private
exports.updateCowork = async (req, res, next) => {

    try {
        const cowork = await CoWork.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!cowork) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: cowork });



    }

    catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc     Delete cowork
//@route    DELETE /api/v1/coworks/:id
//@access   Private
exports.deleteCowork = async (req, res, next) => {

    try {

        const cowork = await CoWork.findById(req.params.id);

        if (!cowork) {
            return res.status(400).json({ success: false,message:`Cowork not found with id of ${req.params.id}`});
        
        }

        await Reservation.deleteMany({ cowork: req.params.id });
        await CoWork.deleteOne({ _id: req.params.id });



        res.status(200).json({ success: true, data: {} });

    }


    catch (err) {
        res.status(400).json({ success: false });
    }

};