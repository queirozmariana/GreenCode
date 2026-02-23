import supabase from '../config/supabase.config.js';

export async function login(req, res) {
    const { email, password } = req.body;
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
    if (data) return res.json({ message: "Login successful!", user: data });
    return res.status(401).json({ error: "Credenciais inválidas" });
}

export async function registerUser(req, res) {
    const { name, email, password, cpf, cep } = req.body;
    const { data, error } = await supabase.from('users').insert({ name, email, password, cpf, cep, user_type: 'pessoal' }).select().single();
    if (error) {
        console.error(error);
     }
    res.status(201).json({ message: "Usuário registrado!", user: data });
}

export async function registerSchool(req, res) {
    const { institution_name, responsible_name, cnpj, cep } = req.body;
    const { data, error } = await supabase.from('users').insert({ institution_name, responsible_name, cnpj, cep, user_type: 'escola' }).select().single();
    if (error) {
        console.error(error);
    }
    res.status(201).json({ message: "Instituição registrada!", user: data });
}