import { json } from '@sveltejs/kit';
import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: SECRET_OPENAI_API_KEY
});

const PROMPT = `
You are a website theme generation bot. When prompted, you will be given a random word and then you will create an SVG that best represents what is specified. For words like "bone", "dragon", or "tree" this should be simple, for words like "love", "hate", or "darkness" you may need to get creative.

Return ONLY the SVG in a valid SVG format and ensure it only includes broadly supported SVG elements and attributes. You may include a viewBox attribute if you wish.
`;

export async function GET({ url: { searchParams } }) {
	const word = searchParams.get('word');
	if (!word) {
		return json({ error: 'No word provided' });
	}
	try {
		const response = await client.chat.completions.create({
			messages: [
				{ role: 'system', content: PROMPT },
				{ role: 'user', content: word }
			],
			model: 'gpt-4o-mini'
		});
		console.log(response);
		return json(response.choices[0].message.content);
	} catch (error) {
		console.error(error);
		return json({ error: 'Error' });
	}
}
