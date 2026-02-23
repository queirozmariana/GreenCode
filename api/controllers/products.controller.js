import supabase from '../config/supabase.config.js';


export async function getAllProducts(req, res) {
    const { type } = req.params;
    const allowedTypes = ["courses", "kits", "ebooks"];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: "Tipo de produto inválido" });
    }

    const { data, error } = await supabase.from(type).select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}

export async function getProductById(req, res) {
    const { type, id } = req.params;
    const allowedTypes = ["courses", "kits", "ebooks"];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: "Tipo de produto inválido" });
    }
    const { data, error } = await supabase.from(type).select("*").eq("id", id).single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(data);
}