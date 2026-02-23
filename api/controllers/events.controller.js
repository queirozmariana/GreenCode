import supabase from '../config/supabase.config.js';

// Função para buscar os próximos eventos
export const getUpcomingEvents = async (req, res) => {
    try {
        const { data, error } = await supabase.from("upcoming_events").select("*");
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Erro ao buscar próximos eventos:", error);
        res.status(500).json({ error: "Não foi possível buscar os próximos eventos." });
    }
};

// Função para buscar os eventos anteriores
export const getPastEvents = async (req, res) => {
    try {
        const { data, error } = await supabase.from("past_events").select("*");
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Erro ao buscar eventos anteriores:", error);
        res.status(500).json({ error: "Não foi possível buscar os eventos anteriores." });
    }
};

// Função para buscar a galeria de fotos
export const getGallery = async (req, res) => {
    try {
        const { data, error } = await supabase.from("gallery").select("*");
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Erro ao buscar a galeria:", error);
        res.status(500).json({ error: "Não foi possível buscar a galeria." });
    }
};