import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


export const userRouter = new Hono();

userRouter.post('/login', async (c) => {

    try {
        // @ts-ignore
        const DATABASE_URL = c.env.DATABASE_URL;
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
                        username: body.email,
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

userRouter.get('/username/:id', async (c: any) => {

    try {

        const userId = c.req.param('id');
        console.log("userId=>", userId);

        const DATABASE_URL = c.env.DATABASE_URL;
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate());

        if (!userId) {
            throw new Error("user id unavailable");
        }

        const usernameDetails = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                username: true,
            },
        });

        if (!usernameDetails) {
            throw new Error("usernameDetails null");
        }

        const username = usernameDetails?.username;

        return c.json(
            {
                message: "Username fetched successfully",
                username
            }
            , 200)

    }
    catch (error) {

        console.log("error==>", error);
        return c.json(
            {
                message: "Username fetched failed",
                error
            }
            , 400)

    }
})

userRouter.put('/username', async (c: any) => {

    const DATABASE_URL = c.env.DATABASE_URL;
    const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        console.log(body);

        if (!(body.username && body.userId)) {
            throw new Error("username,user id not avialable");
        }

        const updatedUsername = await prisma.user.update({
            where: {
                id: body.userId
            },
            data: {
                username: body.username
            }

        });

        return c.json(
            {
                message : "username updated",
                updatedUsername
            }
        )

    }
    catch (error) {
        console.log(error);
        return (
            c.json(
                {
                    message: "error in username update",
                    success: false,
                    error,
                }
            )
        )

    }

})

userRouter.get('/userid/:username', async (c: any) => {
    
    const DATABASE_URL = c.env.DATABASE_URL;
    const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL
    }).$extends(withAccelerate());

    try {

        const username = c.req.param('username');
        console.log(username);

        const fetchedDetails = await prisma.user.findUnique({
            where: {
              username: username
            },
            include: {
              profile: true, 
              skills:true,
              works:true,
              education:true,
              project:true,
            }
        });

        if(!fetchedDetails){
            throw new Error("username details not found");
        }
        
        return c.json(
            {
                message : "username details found",
                fetchedDetails
            }
        )

    }
    catch (error) {
        console.log(error);
        return (
            c.json(
                {
                    message: "error in username update",
                    success: false,
                    error,
                }
            )
        )

    }

})