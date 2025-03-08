# Detailed AWS Deployment Guide with SSL

This guide provides in-depth instructions for deploying your iPhone Apps showcase website to AWS with SSL.

## Prerequisites

1. An AWS account
2. A registered domain name
3. Your website files prepared and ready to upload

## Step 1: Register or Configure Your Domain

If you don't already have a domain name:

1. Go to [Amazon Route 53](https://console.aws.amazon.com/route53/)
2. Click "Registered domains" > "Register domain"
3. Follow the steps to register your domain

If you already have a domain registered elsewhere:
1. You'll need to either transfer it to Route 53 or update the nameservers at your current registrar later

## Step 2: Create an S3 Bucket for Website Hosting

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Open the [S3 console](https://console.aws.amazon.com/s3/)
3. Click "Create bucket"
4. For "Bucket name", enter your domain name (e.g., `example.com`)
5. Choose the AWS Region closest to your audience
6. Under "Block Public Access settings", uncheck "Block all public access"
   - Acknowledge the warning (your website needs to be public)
7. Click "Create bucket"

## Step 3: Configure S3 Bucket for Static Website Hosting

1. Click on your newly created bucket
2. Go to the "Properties" tab
3. Scroll down to "Static website hosting" and click "Edit"
4. Select "Enable" for Static website hosting
5. For "Index document", enter `index.html`
6. Optionally, for "Error document", enter `error.html` or `index.html`
7. Click "Save changes"
8. Note down the "Bucket website endpoint" URL (you'll test with this later)

## Step 4: Set Up Bucket Policy for Public Access

1. In your bucket, go to the "Permissions" tab
2. Under "Bucket policy", click "Edit"
3. Copy and paste the following policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

4. Click "Save changes"

## Step 5: Upload Your Website Files

1. In your bucket, go to the "Objects" tab
2. Click "Upload"
3. Drag and drop all your website files and folders or click "Add files" to select them
4. Maintain your folder structure (css/, js/, images/)
5. Click "Upload"
6. After uploading, visit your bucket website endpoint URL to test if the site works

## Step 6: Request an SSL Certificate

1. Go to [AWS Certificate Manager](https://console.aws.amazon.com/acm/)
2. Ensure you're in the US East (N. Virginia) region (us-east-1) as CloudFront requires certificates from this region
3. Click "Request a certificate"
4. Select "Request a public certificate" and click "Next"
5. Under "Domain names", enter:
   - Your domain (e.g., `example.com`)
   - You should also include the www subdomain (e.g., `*.example.com`)
6. For "Validation method", choose "DNS validation" (recommended)
7. Click "Request"
8. On the next screen, expand each domain and click "Create records in Route 53" to automatically add the validation records
9. Wait for the certificate status to change to "Issued" (may take a few minutes)

## Step 7: Create a CloudFront Distribution

1. Go to [CloudFront](https://console.aws.amazon.com/cloudfront/)
2. Click "Create distribution"
3. Under "Origin domain", select your S3 bucket website endpoint
4. For "Origin path", leave it empty
5. For "Name", you can leave the default or enter a descriptive name
6. Under "Default cache behavior":
   - Viewer protocol policy: Select "Redirect HTTP to HTTPS"
   - Allowed HTTP methods: Select "GET, HEAD"
   - Cache policy: Select "CachingOptimized"
7. Under "Settings":
   - For "Alternate domain names (CNAMEs)", add your domain names (e.g., `example.com`, `www.example.com`)
   - For "Custom SSL certificate", select the certificate you created earlier
   - For "Default root object", enter `index.html`
   - For "Standard logging", enable if you want access logs (optional)
8. Click "Create distribution"
9. Wait for the distribution to deploy (Status will change from "In Progress" to "Deployed")

## Step 8: Set Up Route 53 DNS Records

1. Go to [Route 53](https://console.aws.amazon.com/route53/)
2. Click "Hosted zones"
3. Click your domain name
4. Click "Create record"
5. Leave the "Record name" empty (for the root domain)
6. For "Record type", select "A"
7. Enable "Alias"
8. For "Route traffic to", choose "Alias to CloudFront distribution"
9. Select your CloudFront distribution from the dropdown
10. Click "Create records"

11. Create another record for the www subdomain:
    - For "Record name", enter "www"
    - For "Record type", select "A"
    - Enable "Alias"
    - For "Route traffic to", choose "Alias to CloudFront distribution"
    - Select your CloudFront distribution from the dropdown
    - Click "Create records"

## Step 9: Test Your Website

1. Wait for DNS changes to propagate (can take up to 48 hours, but often much faster)
2. Visit your domain with HTTPS (e.g., `https://example.com`)
3. Verify that:
   - The site loads correctly
   - HTTPS is working (lock icon in browser)
   - All assets (images, CSS, JS) load properly

## Step 10: Set Up Contact Form Functionality (Optional)

To make your contact form functional, you can use AWS services:

### Option 1: Using AWS Lambda and API Gateway

1. Create an AWS Lambda function that sends emails using Amazon SES
2. Set up an API Gateway to create a REST API endpoint
3. Configure CORS to allow your website to make requests to the API
4. Update your contact form JavaScript to send data to your API endpoint

### Option 2: Using Amazon SES directly

1. Verify your email domain in SES
2. Create a Lambda function to process form submissions
3. Set up an API Gateway endpoint that triggers the Lambda function
4. Update the contact form to use your API

## Troubleshooting

### Website Not Loading
- Check that all files were uploaded to S3 with the correct structure
- Verify S3 bucket policy allows public access
- Ensure CloudFront distribution is fully deployed

### SSL Certificate Issues
- Verify the certificate is issued and valid
- Check that the domain names in the certificate match your website domain
- Ensure the certificate is in the US East (N. Virginia) region

### Contact Form Not Working
- Check browser console for JavaScript errors
- Verify API Gateway endpoint is configured correctly
- Ensure CORS settings allow requests from your domain

## Cost Considerations

AWS services used in this deployment include:
- Route 53: ~$0.50/month per hosted zone + domain registration cost
- S3: Storage costs (very low for small websites) + request costs
- CloudFront: Data transfer costs (first 1TB/month is very inexpensive)
- Certificate Manager: Free for public certificates
- Lambda & API Gateway (if used): Free tier available, then pay-per-use

For small to medium websites, costs typically remain under $5-10/month.

## Maintenance

To update your website:
1. Make changes to your local files
2. Upload the changed files to your S3 bucket
3. If needed, create a CloudFront invalidation to clear the cache:
   - Go to your CloudFront distribution
   - Click "Invalidations" tab
   - Create an invalidation with path `/*` to clear everything 