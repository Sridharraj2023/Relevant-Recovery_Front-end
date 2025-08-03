# Relevant Recovery - Client

## Environment Setup

To run this application, you need to set up environment variables. Create a `.env` file in the client directory with the following variables:

```env
# Stripe Configuration
# Get your publishable key from https://dashboard.stripe.com/apikeys
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key_here

# Backend API URL
REACT_APP_API_URL=https://relevant-recovery-back-end.onrender.com
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- Event booking with Stripe payment processing
- Responsive design
- Admin panel for event management
- Donation system

## Troubleshooting

If you see Stripe-related errors, make sure:
1. Your `REACT_APP_STRIPE_PUBLIC_KEY` is set correctly
2. The key is valid and active in your Stripe dashboard
3. You're using test keys for development 