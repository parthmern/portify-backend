import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const contactRoute = new Hono();

contactRoute.post('/contact', async (c: any) => {
    try {

        const DATABASE_URL: string = c.env.DATABASE_URL;
        const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate());

        const body = await c.req.json();

        console.log(body);

        const {
            emailId = '',
            githubUrl = '',
            leetcodeUrl = '',
            linkedinUrl = '',
            twitterUrl = '',
        } = body.profileData;

        const {userId} = body;

        if (!userId) {
            return c.json({ error: 'userId is required' }, 400);
        }

        const contact = await prisma.contact.upsert({
            where: { userId },
            update: { emailId, githubUrl, leetcodeUrl, linkedinUrl, twitterUrl },
            create: { userId, emailId, githubUrl, leetcodeUrl, linkedinUrl, twitterUrl },
        });

        return c.json(contact, 200);
    } catch (error) {
        console.error('Error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});


contactRoute.get('/:userId', async (c:any) => {
    try {
        const DATABASE_URL: string = c.env.DATABASE_URL;
        const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate());
        const { userId } = c.req.param();

        if (!userId) {
            return c.json({ error: 'userId is required' }, 400);
        }

        const contact = await prisma.contact.findUnique({
            where: { userId },
        });

        console.log(contact);

        if (!contact) {
            return c.json({ error: 'Contact not found' }, 404);
        }

        return c.json(contact, 200);
    } catch (error) {
        console.error('Error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});