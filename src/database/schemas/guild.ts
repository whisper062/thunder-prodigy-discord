import { Schema } from 'mongoose';
import { t } from '../utils.js';

export const guildSchema = new Schema(
    {
        id: t.string,

        channels: {
            caixa: { type: String, default: null },
            logsCaixa: { type: String, default: null },
        },

        money: {
            dinheiroLimpo: { type: Number, default: 0 },
            dinheiroSujo: { type: Number, default: 0 },
            macos: { type: Number, default: 0 },
            rolos: { type: Number, default: 0 },
            notas: { type: Number, default: 0 },
        },
    },
    {
        statics: {
            async get(id: string) {
                return this.findOneAndUpdate(
                    { id },
                    { $setOnInsert: { id } },
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                );
            },

            async set(id: string, data: Record<string, any>) {
                return this.findOneAndUpdate(
                    { id },
                    { $set: data },
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                );
            },

            async inc(id: string, data: Record<string, number>) {
                return this.findOneAndUpdate(
                    { id },
                    { $inc: data },
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                );
            },
        },
    },
);
