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

        // Send a more descriptive error message based on the type of error
        if (error.response) {
            // The request was made and the server responded with a status code outside the range of 2xx
            console.error('Error response data:', error.response.data);
            res.status(error.response.status).json({
                message: 'Error adding contact to Brevo',
                error: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request data:', error.request);
            res.status(500).json({
                message: 'Error adding contact to Brevo',
                error: 'No response received from Brevo API'
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({
                message: 'Error adding contact to Brevo',
                error: error.message
            });
        }
    }
}
