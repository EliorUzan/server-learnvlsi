const express = require('express');
const router = express.Router();
const Database = require('../../Database'); // Update the path as needed

router.get('/:pageName', async (req, resp, next) => {
    const pageName  = req.params.pageName;
    console.log("blablabla")
    console.log("my pageName is:",pageName)
    try {
        const questionData = await Database.getQuestion(pageName);
        if (questionData.ok) {
            resp.status(200).json(questionData);
        } else {
            resp.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        resp.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
