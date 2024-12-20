import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Cloudflare API URL
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dncm3mid4/image/upload';
const UPLOAD_PRESET = 'xas6zgld'; // If you have an upload preset

// Upload function to Cloudinary
async function uploadToCloudinary(file: any) {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: form,
    });

    console.log("img url=>", response);

    if (response.status != 200) {
        console.log('error');
        throw new Error("Image upload failed");
    }

    return response.json();
}

export const profileRouter = new Hono();


// Route for profile upload
profileRouter.post('/profile', async (c: any) => {
    try {
        const DATABASE_URL = c.env.DATABASE_URL;
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate());

        const formData: any = await c.req.parseBody(); // Parse form data

        console.log(formData);
        const file: any = formData.img; // Access the file in the form data
        const fields: any = formData; // Access other fields

        if (!file) {
            return c.json({ error: 'No file uploaded' }, 400);
        }

        // Upload to Cloudinary
        const uploadResponse: any = await uploadToCloudinary(file);

        // Prepare response data
        //@ts-ignore
        const data: any = {
            name: fields?.name,
            about: fields?.about,
            img: uploadResponse.secure_url, // Cloudinary URL of the uploaded image
            userId: JSON.parse(fields?.userData).id,
        };

        const profileId = fields?.profileId;
        console.log(uploadResponse.secure_url);

        const isPorfileAvailable = await prisma.profile.findUnique({
            where: {
                id: profileId,
            }
        });

        if (!isPorfileAvailable) {
            const createdProfile = await prisma.profile.create(
                {
                    data: data
                }
            )
            return c.json(createdProfile, 200);
        } else {
            const updatedProfile = await prisma.profile.update({
                where: {
                    id: profileId,
                },
                data: data,
            });

            return c.json(updatedProfile, 200);
        }





    } catch (error: any) {
        console.log(error);
        return c.json({ error: 'File upload or processing failed', message: error.message }, 500);
    }
});
