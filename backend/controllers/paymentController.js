const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res) => {
  const { amount, description } = req.body;

  const myPayment = await stripe.paymentIntents.create({
    amount,
    description,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors((req, res) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
