import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


export const userRouter = new Hono();

userRouter.post('/', async (c) => {

    try {
        // @ts-ignore
        const DATABASE_URL = c.env.DATABASE_URL ;
        console.log("dburl=>", DATABASE_URL);
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate());

        const body = await c.req.json();
        console.log(body);

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            }
        });

        if (!user) {
            const createdUser = await prisma.user.create(
                {
                    data: {
                        id: body.id,
                        email: body.email,
                        name: body.name,
                        password: body.password,
                    }
                }
            )
            console.log("created user => ", createdUser);
            c.status(200);
            return c.json(
                {
                    success: true,
                    message: "New user created Successfully",
                    createdUser,
                }
            )
        }
        else {
            console.log("existing user =>", user);
            c.status(200);
            return c.json(
                {
                    success: true,
                    message: "New user created Successfully",
                    user,
                }
            )
        }
    }
    catch (error) {
        console.log("error in login =>", error);
        c.json(400);
        return c.json({
            success: false,
            message: "Error in Login",
            error
        })
    }

})