import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email } = req.body;

    try {
        const response = await axios.post('https://api.sendinblue.com/v3/contacts', {
            email: email,
            attributes: {
                FIRSTNAME: name,
            },
            listIds: [10] // Replace with your actual list ID from Brevo
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.SENDINBLUE_API_KEY
            }
        });

        res.status(200).json({ message: 'Success', data: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error', error: error.response ? error.response.data : error.message });
    }
}
