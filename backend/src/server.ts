import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import championshipRoutes from './routes/championships.routes';
import orderRoutes from './routes/orders.routes';
import ticketRoutes from './routes/tickets.routes';
import creditCardRoutes from './routes/creditCards.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/championships', championshipRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server API is running on http://localhost:${PORT}`);
});
