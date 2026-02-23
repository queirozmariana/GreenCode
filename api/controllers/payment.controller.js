import Stripe from "stripe";
import supabase from "../config/supabase.config.js";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "ERRO CRÍTICO: STRIPE_SECRET_KEY não foi encontrada no arquivo .env. A aplicação não pode iniciar o sistema de pagamento."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const user_id = req.userId;

  try {
    const { data: cartItems, error: cartError } = await supabase.rpc(
      "get_cart_items",
      { p_user_id: user_id }
    );
    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Seu carrinho está vazio." });
    }

    const line_items = cartItems.map((item) => {
      const priceInCents =
        parseFloat(item.price.replace("R$", "").replace(",", ".")) * 100;
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: item.title,
            images: [item.image],
          },
          unit_amount: Math.round(priceInCents),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success.html`,
      cancel_url: `${process.env.FRONTEND_URL}/carrinho.html`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("ERRO AO CRIAR SESSÃO DO STRIPE:", error);
    res
      .status(500)
      .json({ error: "Não foi possível iniciar o processo de pagamento." });
  }
};

export const createSingleProductCheckout = async (req, res) => {
  const user_id = req.userId;
  const { product, productType, cancelUrl } = req.body;
  console.log("Corpo da requisição recebido:", req.body);

  if (!product || !product.title || !product.price) {
    return res.status(400).json({ error: "Dados do produto insuficientes." });
  }

  try {
    const priceInCents =
      parseFloat(product.price.replace("R$", "").replace(",", ".")) * 100;

    const line_item = {
      price_data: {
        currency: "brl",
        product_data: {
          name: product.title,
          images: [product.image],
        },
        unit_amount: Math.round(priceInCents),
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [line_item],
      success_url: `${process.env.FRONTEND_URL}/success.html`,
      cancel_url: cancelUrl,
      customer_email: req.userEmail,
      metadata: {
        user_id: user_id,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("ERRO AO CRIAR SESSÃO DE CHECKOUT RÁPIDO:", error);
    res.status(500).json({ error: "Não foi possível iniciar o pagamento." });
  }
};
