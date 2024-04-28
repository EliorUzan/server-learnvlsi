const express = require('express');
const router = express();
const Database = require('../../Database'); // Update the path as needed
const path = require('path')

router.get('/:pageName', async (req, resp, next) => {
    const pageName  = req.params.pageName;
    try {
        const questionData = await Database.getRandomQuestion(pageName);
        console.log('questionData: ',questionData)
        console.log('pwd: ',__dirname)
        const qdir_name = `${questionData.questionHeadline}__${questionData.questionField}__${questionData.questionSubField}`
        console.log('qdir_name: ',qdir_name)
        const relativePath = path.join(__dirname, '..', '..', '..','..', 'Questions', 'Approved', qdir_name)
        // const relativePath = [__dirname, 'Questions', 'Approved', qdir_name].join('\\')
        console.log('relativePath: ',relativePath)
        // const qdir_staticPath = path.join(__dirname, '..', '..', '..','..', 'Questions', 'Approved', qdir_name);
        console.log('qdir_staticPath: ',relativePath);
        const staticPath = express.static(relativePath)
        router.use(`/${questionData.questionHeadline}`,staticPath);
        if (questionData.ok) {
            resp.status(200).json(questionData);
        } else {
            resp.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
