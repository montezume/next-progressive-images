import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import NodeCache from "node-cache";

const cache = new NodeCache();

const headers = {
  Accept: "application/json",
  Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const page = req.query.page as string;
  const perPage = (req.query.per_page || 10) as string;

  try {
    const cachedValue = cache.get(page);

    if (cachedValue) {
      res.setHeader("USED-CACHE", "true");
      return res.status(200).json(cachedValue);
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=cat&page=${page}&per_page=${perPage}`,
      {
        headers
      }
    );

    const data = await response.json();
    cache.set(page, JSON.stringify(data), 10000);
    res.setHeader("USED-CACHE", "false");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
