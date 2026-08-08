import * as aiService from "../services/ai.service.js";

export const getResult = async (req, res) => {
    try{

        const { prompt } = req.query;
        const result = await aiService.generateResult(prompt);
        res.send(result);

    } catch(err){
        res.status(500).send({message: err.message});
    }
}