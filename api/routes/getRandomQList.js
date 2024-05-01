const express = require('express')
const router  = express.Router();
const Database = require('../../Database'); 

router.get('/:field', 
    async (req,resp,next) => {
        try {
            const field = req.params.field
            const qList = await Database.getRandomQList(field);
            if (qList.ok) {
                resp.status(200).json(
                    {
                        ok: true,
                        QList: qList.randomQList
                    }

                );
            } else {
                resp.status(404).json({
                    message: "Questions Not Found",
                    ok: false
                })
            }
        } catch (error) {
            resp.status(500).json(
                {
                    ok: false,
                    error: error,
                    message: "Internal Server Error"
                }
            );
        }
    }
);

router.get('/:field/:sub_field', 
    async (req,resp,next) => {
        try {
            const field = req.params.field
            const sub_field = req.params.sub_field
            const qList = await Database.getRandomQList(field,sub_field);
            console.log(qList)
            if (qList.ok) {
                resp.status(200).json(
                    {
                        ok: true,
                        QList: qList.randomQList
                    }

                );
            } else {
                resp.status(404).json({
                    message: "Questions Not Found",
                    ok: false
                })
            }
        } catch (error) {
            resp.status(500).json(
                {
                    ok: false,
                    error: error,
                    message: "Internal Server Error"
                }
            );
        }
    }
);

module.exports = router