import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'api', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Erro Crítico: Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não foram encontradas. Verifique se o arquivo 'api/.env' existe e está configurado corretamente.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;