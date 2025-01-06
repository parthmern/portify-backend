import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

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

export const projectRoute = new Hono();

projectRoute.post("/", async (c: any) => {
    try {
        const DATABASE_URL: string = c.env.DATABASE_URL;
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL,
        }).$extends(withAccelerate());

        const formData: any = await c.req.parseBody();
        console.log(formData);

        const imageFile: any = formData.image;
        const thumbnailFile: any = formData.thumbnail;
        const featuredVideoFile: any = formData.featuredVideo;
        const fields: any = formData;

        console.log("imageFile==>", imageFile);
        console.log("thumbnailFile==>", thumbnailFile);
        console.log("featuredVideoFile==>", featuredVideoFile);
        console.log("fields==>", fields);

        if (!fields || !fields.userId) {
            throw new Error("Form data or userId is required");
        }

        // Upload files to Cloudinary
        let imageUploadResponse: any;
        let thumbnailUploadResponse: any;
        let featuredVideoUploadResponse: any;

        if (imageFile) {
            imageUploadResponse = await uploadToCloudinary(imageFile);
            console.log("image url==>", imageUploadResponse.secure_url);
        }

        if (thumbnailFile) {
            thumbnailUploadResponse = await uploadToCloudinary(thumbnailFile);
            console.log("thumbnail url==>", thumbnailUploadResponse.secure_url);
        }

        if (featuredVideoFile) {
            featuredVideoUploadResponse = await uploadToCloudinary(featuredVideoFile);
            console.log("featured video url==>", featuredVideoUploadResponse.secure_url);
        }


        // Create a new project
        const createdProject = await prisma.project.create({
            data: {
                userId: fields.userId,
                title: fields.title,
                href: fields.href,
                description: fields.description,
                technologies: fields.technologies ? fields.technologies.split(',').map((item: any) => item.trim()) : [],
                liveLink: fields.liveLink || null,
                githubRepoLink: fields.githubRepoLink || null,
                otherLink: fields.otherLink || null,
                image: imageFile && imageUploadResponse?.secure_url ? imageUploadResponse.secure_url : null,
                thumbnail: thumbnailFile && thumbnailUploadResponse?.secure_url ? thumbnailUploadResponse.secure_url : null,
                featuredVideo: featuredVideoFile && featuredVideoUploadResponse?.secure_url ? featuredVideoUploadResponse?.secure_url : null,
                video: fields.video || null,
                featured: fields.featured == "true" ? true : false,
                context: fields.context || null,
            },
        });

        console.log("createdProject==>", createdProject);
        return c.json(createdProject, 200);
    } catch (error: any) {
        console.error(error);
        return c.json({ error: error.message }, 500);
    }
});
