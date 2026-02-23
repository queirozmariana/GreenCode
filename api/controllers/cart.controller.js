import supabase from "../config/supabase.config.js";

export const addToCart = async (req, res) => {
  const user_id = req.userId;
  const { productId, productType } = req.body;

  if (!productId || !productType) {
    return res
      .status(400)
      .json({ error: "ID e tipo do produto são obrigatórios." });
  }

  try {
    // Verifica se o item já existe no carrinho para este usuário
    const { data: existingItem, error: findError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user_id)
      .eq("product_id", productId)
      .eq("product_type", productType)
      .single();

    if (findError && findError.code !== "PGRST116") throw findError;

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        user_id,
        product_id: productId,
        product_type: productType,
        quantity: 1,
      });
      if (insertError) throw insertError;
    }

    res.status(201).json({ message: "Produto adicionado ao carrinho!" });
  } catch (error) {
    console.error("ERRO NO BACKEND AO ADICIONAR AO CARRINHO:", error);

    res.status(500).json({
      error: "Erro interno do servidor ao adicionar produto.",
      details: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  const user_id = req.userId;
  const { itemId } = req.params;
  const { newQuantity } = req.body;

  if (!newQuantity || newQuantity < 1) {
    return res.status(400).json({ error: "Quantidade inválida." });
  }

  try {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", itemId)
      .eq("user_id", user_id);

    if (error) throw error;
    res.status(200).json({ message: "Quantidade atualizada com sucesso." });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR ITEM DO CARRINHO:", error);
    res.status(500).json({
      error: "Erro ao atualizar item do carrinho.",
      details: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  const user_id = req.userId;
  const { itemId } = req.params;

  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", user_id);

    if (error) throw error;
    res.status(200).json({ message: "Item removido do carrinho." });
  } catch (error) {
    console.error("ERRO AO REMOVER ITEM DO CARRINHO:", error);
    res.status(500).json({
      error: "Erro ao remover item do carrinho.",
      details: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  const user_id = req.userId;

  try {
    const { data, error } = await supabase.rpc("get_cart_items", {
      p_user_id: user_id,
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar itens do carrinho.",
      details: error.message,
    });
  }
};
