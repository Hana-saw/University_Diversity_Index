import { defineCollection, z } from 'astro:content';

const universitiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    name_en: z.string().optional(),
    region: z.string(),
    prefecture: z.string(),
    gender_ratio_female_prof: z.number().min(0).max(100),
    lgbtq_policy: z.enum(['実施済み', '検討中', '未着手']),
    lgbtq_policy_detail: z.string().optional(),
    barrier_free_score: z.number().min(1).max(5),
    barrier_free_detail: z.string().optional(),
    international_ratio: z.number().min(0).max(100).optional(),
    official_url: z.string().url(),
    github_id: z.string(),
    last_updated: z.string(),
    data_source: z.string().optional(),
  }),
});

export const collections = {
  universities: universitiesCollection,
};
