const express = require('express');
const router = express();
const Database = require('../../Database'); // Update the path as needed
const path = require('path')

router.get('/getQuestion/:headline', async (req, resp, next) => {
        headline = req.params.headline
        try {
            const questionData = await Database.getQuestionByHeadline(headline);
            console.log(questionData)
            const qdir_name = `${questionData.questionHeadline}__${questionData.questionField}__${questionData.questionSubField}`;
            if (questionData.ok) {
                server_json_GET_resp = {
                    ...questionData,
                    questionHTML: `${qdir_name}/${questionData.questionHTML}`,
                    question_picture: `${qdir_name}/${questionData.question_picture}`,
                    answerHTML: `${qdir_name}/${questionData.answerHTML}`,
                    answer_picture: `${qdir_name}/${questionData.answer_picture}`,
                  }
                console.log('server_json_GET_response: ',server_json_GET_resp)
                resp.status(200).json(server_json_GET_resp);
            } else {
                resp.status(404).json({ message: 'Question not found' });
            }
        } catch (error) {
            console.log(error)
            resp.status(500).json({ message: 'Internal server error' });
        }
    }
);

router.get('/:pageName', async (req, resp, next) => {
    const pageName  = req.params.pageName;
    try {
        const questionData = await Database.getRandomQuestion(pageName);
        console.log('questionData: ',questionData)
        console.log('pwd: ',__dirname)
        const qdir_name = `${questionData.questionHeadline}__${questionData.questionField}__${questionData.questionSubField}`
        console.log('qdir_name: ',qdir_name)
        // const relativePath = path.join(__dirname, '..', '..', '..','..', 'Questions', 'Approved', qdir_name)
        // const relativePath = [__dirname, 'Questions', 'Approved', qdir_name].join('\\')
        // console.log('relativePath: ',relativePath)
        // const qdir_staticPath = path.join(__dirname, '..', '..', '..','..', 'Questions', 'Approved', qdir_name);
        // console.log('qdir_staticPath: ',relativePath);
        // const staticPath = express.static(relativePath)
        // router.use(`/${questionData.questionHeadline}`,staticPath);
        if (questionData.ok) {
            server_json_GET_resp = {
                ...questionData,
                questionHTML: `${qdir_name}/${questionData.questionHTML}`,
                question_picture: `${qdir_name}/${questionData.question_picture}`,
                answerHTML: `${qdir_name}/${questionData.answerHTML}`,
                answer_picture: `${qdir_name}/${questionData.answer_picture}`,
              }
            console.log('server_json_GET_response: ',server_json_GET_resp)
            resp.status(200).json(server_json_GET_resp);
        } else {
            resp.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:pageName', async (req, resp, next) => {
    const pageName = req.params.pageName;
    const alreadyAskedQs = req.body.alreadyAskedQs;
    console.log('from question.js AlreadyAskedQs: ', req.body.alreadyAskedQs)
    try {
      const questionData = await Database.getRandomQuestion(pageName, alreadyAskedQs);
      const qdir_name = `${questionData.questionHeadline}__${questionData.questionField}__${questionData.questionSubField}`
      if (questionData.ok) {
        server_json_POST_resp = {
            ...questionData,
            questionHTML: `${qdir_name}/${questionData.questionHTML}`,
            question_picture: `${qdir_name}/${questionData.question_picture}`,
            answerHTML: `${qdir_name}/${questionData.answerHTML}`,
            answer_picture: `${qdir_name}/${questionData.answer_picture}`,
          }
        console.log('server_json_POST_response: ',server_json_POST_resp)
        resp.status(200).json(server_json_POST_resp);
      } else {
        resp.status(404).json({ message: 'Question not found' });
      }
    } catch (error) {
      console.log(error);
      resp.status(500).json({ message: 'Internal server error' });
    }
  });

  router.use('/showQuestion/:qdir_name/:file', (req, res, next) => {
    const qdir_name = req.params.qdir_name;
    const file = req.params.file;
    const filePath = path.join(__dirname, '..', '..', '..', '..', 'Questions', 'Approved', qdir_name, file);
    console.log(filePath)
    res.sendFile(filePath, (err) => {
      if (err) {
        next(err);
      }
    });
  });

module.exports = router;
