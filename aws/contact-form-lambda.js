// AWS Lambda function for handling contact form submissions
// This function receives form data and sends an email using Amazon SES

const AWS = require('aws-sdk');
const SES = new AWS.SES({ region: 'us-east-1' }); // Change region if needed

// Update these values with your own
const SOURCE_EMAIL = 'contact@yourdomain.com'; // Must be verified in SES
const DESTINATION_EMAIL = 'your-email@example.com'; // Where you want to receive emails
const WEBSITE_URL = 'https://yourdomain.com'; // Your website URL for CORS

exports.handler = async (event) => {
    // Set up response headers for CORS
    const headers = {
        'Access-Control-Allow-Origin': WEBSITE_URL,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Preflight call successful' })
        };
    }
    
    try {
        // Parse the incoming request body
        const body = JSON.parse(event.body);
        
        // Extract form data
        const { name, email, message } = body;
        
        // Basic validation
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    message: 'Missing required fields. Please provide name, email, and message.' 
                })
            };
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Invalid email format.' })
            };
        }
        
        // Construct the email params
        const emailParams = {
            Source: SOURCE_EMAIL,
            Destination: {
                ToAddresses: [DESTINATION_EMAIL]
            },
            ReplyToAddresses: [email],
            Message: {
                Subject: {
                    Data: `New Contact Form Submission from ${name}`
                },
                Body: {
                    Text: {
                        Data: `
Name: ${name}
Email: ${email}
Message:

${message}

---
This message was sent from your website contact form.
`
                    },
                    Html: {
                        Data: `
<html>
<body>
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><em>This message was sent from your website contact form.</em></p>
</body>
</html>
`
                    }
                }
            }
        };
        
        // Send the email
        await SES.sendEmail(emailParams).promise();
        
        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                message: 'Thank you! Your message has been sent successfully.' 
            })
        };
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        
        // Return error response
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                message: 'There was an error processing your request. Please try again later.' 
            })
        };
    }
}; 