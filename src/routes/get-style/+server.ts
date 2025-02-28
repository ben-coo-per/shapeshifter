import { json } from '@sveltejs/kit';
import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: SECRET_OPENAI_API_KEY
});

const PROMPT = `
You are a website theme generation bot. When prompted, you will be given a list of 3 random words and then you will create a CSS styling template to match. 

Return ONLY the CSS stylesheet in a valid CSS format and ensure it only includes styles (psuedo classes allowed) for the following elements:
.gpt-body
.gpt-button
.gpt-input
.gpt-header
.gpt-container
.gpt-animation-el
.gpt-text

Ensure you change the gpt-body background color every time
`;

export async function GET({ url: { searchParams } }) {
	const words = searchParams.get('words');
	if (!words) {
		return json({ error: 'No words provided' });
	}
	try {
		const response = await client.chat.completions.create({
			messages: [
				{ role: 'system', content: PROMPT },
				{ role: 'user', content: words }
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
