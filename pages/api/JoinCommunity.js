import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

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
        console.error('Error adding contact to Brevo:', error.message);

        if (error.response) {
            const errorCode = error.response.data.code;
            const errorMessage = error.response.data.message;

            if (errorCode === 'duplicate_parameter' && errorMessage === 'Contact already exist') {
                res.status(409).json({ message: 'Email already exists', error: error.response.data });
            } else {
                console.error('Error response data:', error.response.data);
                res.status(error.response.status).json({
                    message: 'Error adding contact to Brevo',
                    error: error.response.data
                });
            }
        } else if (error.request) {
            console.error('Error request data:', error.request);
            res.status(500).json({
                message: 'Error adding contact to Brevo',
                error: 'No response received from Brevo API'
            });
        } else {
            res.status(500).json({
                message: 'Error adding contact to Brevo',
                error: error.message
            });
        }
    }
}
