import express from 'express'
import { ObjectId } from 'mongodb';
import { getClient } from '../db';
import SingleStory from '../models/SingleStory';

const storiesRouter = express.Router();

const catchError = (err: any, res: any) => {
    console.error("FAIL", err);
    res.status(500).json({ message: "internal server error" });
};

storiesRouter.get("/:uid", async (req, res) => {
    const uid = req.params.uid;
    try {
        const client = await getClient();
        const results = client.db().collection<SingleStory>("stories").aggregate([{ $match: { uid: uid } }])
        res.json(await results.toArray());
    } catch (err) {
        catchError(err, res)
    }
})

storiesRouter.post("/", async (req, res) => {
    const newStory: SingleStory = req.body;
    try {
        const client = await getClient()
        await client.db().collection<SingleStory>("stories").insertOne(newStory);

        res.status(201).json(newStory)
    } catch (err) {
        catchError(err, res)
    }
})

storiesRouter.put("/fav/:id", async (req, res) => {
    const id = req.params.id;
    let setFav = false;
    try {
        const client = await getClient();
        const story = await client.db().collection<SingleStory>("stories").findOne({ _id: new ObjectId(id) });
        if (story?.favorite === false) {
            setFav = true;
        }
        await client.db().collection<SingleStory>("stories").updateOne({ _id: new ObjectId(id) }, { $set: { favorite: setFav } })
        res.json(story)
    } catch (err) {
        catchError(err, res)
    }
})
storiesRouter.put("/privacy/:id", async (req, res) => {
    const id = req.params.id;
    let setPrivacy = false;
    try {
        const client = await getClient();
        const story = await client.db().collection<SingleStory>("stories").findOne({ _id: new ObjectId(id) });
        if (story?.public === false) {
            setPrivacy = true;
        }
        await client.db().collection<SingleStory>("stories").updateOne({ _id: new ObjectId(id) }, { $set: { public: setPrivacy } })
        res.json(story)
    } catch (err) {
        catchError(err, res)
    }
})

storiesRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const client = await getClient();
        await client.db().collection<SingleStory>("stories").deleteOne({ _id: new ObjectId(id) });
        res.sendStatus(204)
    } catch (err) { catchError(err, res) }
})

export default storiesRouter;