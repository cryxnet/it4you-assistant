import { NextApiRequest, NextApiResponse } from 'next';
import OpenAIService from '../../lib/services/openai';

const openaiService = new OpenAIService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Initialize the OpenAI service
        await openaiService.init();

        // Extract message from request body
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get the response from OpenAI service
        const response = await openaiService.chat(message);

        // Send the OpenAI response back to the client
        return res.status(200).json({ response });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
