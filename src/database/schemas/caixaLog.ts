import { Document, Schema } from 'mongoose';
import { t } from '../utils.js';

export type TipoTransacao = 'deposito' | 'saque';
export type NaturezaTransacao = 'legal' | 'ilegal';

export interface CaixaLog extends Document {
    guildId: string;
    userId: string;
    tipo: TipoTransacao;
    natureza: NaturezaTransacao;
    total: number;
    macos: number;
    rolos: number;
    notas: number;
    createdAt: Date;
}

export const caixaLogSchema = new Schema<CaixaLog>(
    {
        guildId: t.string,
        userId: t.string,
        tipo: { type: String, enum: ['deposito', 'saque'], required: true },
        natureza: { type: String, enum: ['legal', 'ilegal'], required: true },
        total: { type: Number, required: true },
        macos: { type: Number, required: true },
        rolos: { type: Number, required: true },
        notas: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        statics: {
            async register(data: any) {
                return this.create(data);
            },
            async findByUser(userId: string, limit?: number) {
                const query = this.find({ userId }).sort({ createdAt: -1 });
                if (limit) query.limit(limit);
                return query;
            },
            async findByGuild(guildId: string, limit?: number) {
                const query = this.find({ guildId }).sort({ createdAt: -1 });
                if (limit) query.limit(limit);
                return query;
            },
            async findRecent(limit = 20) {
                return this.find().sort({ createdAt: -1 }).limit(limit);
            },
        },
    },
);
