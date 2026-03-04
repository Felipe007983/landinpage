import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { name, cpf, email, phone, password, address } = req.body;
            const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { cpf }] } });
            if (exists) return res.status(400).json({ error: 'E-mail ou CPF já cadastrados' });

            const password_hash = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { name, cpf, email, phone, password_hash, address }
            });

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
            res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

            const matches = await bcrypt.compare(password, user.password_hash);
            if (!matches) return res.status(401).json({ error: 'Senha incorreta' });

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
            res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (e) {
            res.status(500).json({ error: 'Erro no login' });
        }
    }

    static async me(req: Request, res: Response) {
        const id = (req as any).user?.id;
        if (!id) return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, cpf: true, phone: true, role: true } });
        res.json(user);
    }
}
