export const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Nenhum token de autorização fornecido. Faça o login.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Token mal formatado.' });
    }

    const userId = parts[1];

    req.userId = userId;

    next();
};