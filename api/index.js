import express from "express";
import cors from "cors";

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import eventsRoutes from './routes/events.routes.js';

const port = process.env.PORT || 3000;
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/events', eventsRoutes); 

app.get('/api', (req, res) => {
    res.json({ message: 'Bem-vindo à API da GreenCode!' });
});

app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}!`);
});