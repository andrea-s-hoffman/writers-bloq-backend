import express from 'express'
import { ObjectId } from 'mongodb';
import { getClient } from '../db';
import SingleStory from '../models/SingleStory';

const storiesRouter = express.Router();

const catchError = (err: any, res: any) => {
    console.error("FAIL", err);
    res.status(500).json({ message: "internal server error" });
};

storiesRouter.get("/", async (req, res) => {
    try {
        const client = await getClient();
        const results = client.db().collection<SingleStory>("stories").find()
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
    try {
        const client = await getClient();
        await client.db().collection<SingleStory>("stories").updateOne(
            { _id: new ObjectId(id) },
            [
                {
                    $set: {
                        favorite: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$favorite", true] }, then: false },
                                    { case: { $eq: ["$favorite", false] }, then: true }
                                ],
                                default: ""
                            }
                        }
                    }
                }
            ]
        )
        res.sendStatus(201)
    } catch (err) {
        catchError(err, res)
    }
})
storiesRouter.put("/privacy/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const client = await getClient();
        await client.db().collection<SingleStory>("stories").updateOne(
            { _id: new ObjectId(id) },
            [
                {
                    $set: {
                        public: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$public", true] }, then: false },
                                    { case: { $eq: ["$public", false] }, then: true }
                                ],
                                default: ""
                            }
                        }
                    }
                }
            ]
        )
        res.sendStatus(201)
    } catch (err) {
        catchError(err, res)
    }
})

storiesRouter.put("/upvotes/up/:id", async (req, res) => {
    const id: string = req.params.id;
    try {
        const client = await getClient();
        await client.db().collection<SingleStory>("stories").updateOne({ _id: new ObjectId(id) }, { $inc: { upvotes: 1 } })
        res.sendStatus(201)
    } catch (err) {
        catchError(err, res)
    }
})
storiesRouter.put("/upvotes/down/:id", async (req, res) => {
    const id: string = req.params.id;
    try {
        const client = await getClient();
        await client.db().collection<SingleStory>("stories").updateOne({ _id: new ObjectId(id) }, { $inc: { upvotes: -1 } })
        res.sendStatus(201)

    } catch (err) {
        catchError(err, res)
    }
})

storiesRouter.post("/comment/:id", async (req, res) => {
    const id: string = req.params.id;
    const comment: any = req.body;
    try {
        const client = await getClient();
        await client.db().collection<SingleStory>("stories").
            updateOne({ _id: new ObjectId(id) }, { $push: { comments: comment } })
        res.status(201).json(comment)
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