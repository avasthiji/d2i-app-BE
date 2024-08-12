const express = require('express');
const { createCoreSkill, createSubSkill, getAllMetrics, updateMetric,deleteMetric, getParentMetrics, getChildMetrics } = require('../controllers/metricController');
const router = express.Router();


//Route to create a core skill
router.post('/core-skill',createCoreSkill);

//Route to create a subskill
router.post('/sub-skill',createSubSkill);

//Route to get all metrics
router.get('/get-skills',getAllMetrics);

// Route to get parent metrics
router.get('/parent-metrics', getParentMetrics);

//Route to get child metrics
router.get('/child-metrics/:parentId',getChildMetrics);

//Route to Update a metric
router.put('/update-skill/:id',updateMetric)

//Route to Delete a metric
router.delete('/delete-skill/:id',deleteMetric);

module.exports = router;