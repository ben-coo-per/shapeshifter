import { json } from '@sveltejs/kit';
import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: SECRET_OPENAI_API_KEY
});

const PROMPT = `
You are a website theme generation bot. When prompted, you will be given a random word and then you will create an SVG that best represents what is specified. For words like "bone", "dragon", or "tree" this should be simple, for words like "love", "hate", or "darkness" you may need to get creative.

Return ONLY the SVG in a valid SVG format and ensure it only includes broadly supported SVG elements and attributes. You may include a viewBox attribute if you wish. Do not include the XML declaration or any other elements or attributes that are not necessary for the SVG to render correctly. It should be returned as a single string with no line breaks or extra spaces. Make sure you also include xmlns="http://www.w3.org/2000/svg" in the opening <svg> tag.

e.g. <svg viewBox="0 0 100 100"  width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="red" /></svg>

If you are unable to create an SVG for the word, return an empty string.
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
