import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const skillsRouter = new Hono();

skillsRouter.post('/', async (c: any) => {

    const DATABASE_URL: string = c.env.DATABASE_URL;
    const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const reqData = await c.req.json();
        console.log(reqData);

        const skills: Array<string> = reqData?.skills;
        const userId: string = reqData?.userId;

        if (!userId) {
            throw Error("User id not available");
        }

        const isSkillsAvailable = await prisma.skills.findUnique({
            where: {
                userId: userId,
            }
        });

        if (!isSkillsAvailable) {
            console.log("skills not available so creating a new skills section");
            const createdSkillsSection = await prisma.skills.create({
                data: {
                    userId: userId,
                    name: skills,
                }
            });
            console.log(createdSkillsSection);

            return c.json({
                success: true,
                message: "New skills section created successfully",
                createdSkillsSection,
            }, 200);

        } else {
            console.log("skills availabe so updating previous section");
            const updatedSkillsSection = await prisma.skills.update({
                where: {
                    userId: userId,
                },
                data: {
                    name: skills,
                }
            })

            console.log(updatedSkillsSection);

            return c.json({
                success: true,
                message: "Old skills section updated successfully",
                updatedSkillsSection,
            }, 200);

        }

    }
    catch (error) {
        console.log("ERROR==>", error);
        return c.json({
            message: `Error while updating Skills`,
            error: error
        }, 400);

    }




})

skillsRouter.get('/:id', async (c: any) => {
    const DATABASE_URL: string = c.env.DATABASE_URL;
    const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL
    }).$extends(withAccelerate());

    try {

        const userId: string = c.req.param('id');
        console.log("userId=>", userId);

        if (!userId) {
            throw Error("User id not available");
        }

        const fetchedSkillsSection = await prisma.skills.findUnique({
            where: {
                userId: userId
            }
        })

        // if (!fetchedSkillsSection) {
        //     throw Error("Error while fetching skills");
        // }

        console.log(fetchedSkillsSection);

        return c.json({
            success: true,
            message: "skills section fetched successfully",
            skills: fetchedSkillsSection || "",
        }, 200);


    }
    catch (error) {
        console.log("ERROR==>", error);
        return c.json({
            message: `Error while fetching Skills`,
            error: error
        }, 400);
    }
})