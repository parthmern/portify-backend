import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Cloudflare API URL
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dncm3mid4/image/upload';
const UPLOAD_PRESET = 'xas6zgld';

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

export const educationRoute = new Hono();

educationRoute.post("/", async (c: any) => {
  try {
    const DATABASE_URL: string = c.env.DATABASE_URL;
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL
    }).$extends(withAccelerate());

    const formData: any = await c.req.parseBody();
    console.log(formData);

    const file: any = formData.logo;
    const fields: any = formData;
    const userId: string = fields.userId;

    console.log("file==>", file);
    console.log("fields==>", fields);
    console.log("userId=>", userId);

    if (!fields || !userId) {
      throw new Error("Form data or userId is required");
    }

    let uploadResponse: any;
    if (file) {
      uploadResponse = await uploadToCloudinary(file);
      console.log(uploadResponse.secure_url);
    }

    const createdEducation = await prisma.education.create({
      data: {
        userId,
        name: fields.name,
        href: fields.href,
        degree: fields.degree,
        logoUrl: file && uploadResponse?.secure_url ? uploadResponse?.secure_url : null,
        start: fields.start,
        end: fields.end,
        description: fields.description,
      },
    });

    console.log("createdEducation==>", createdEducation);
    return c.json(createdEducation, 200);

  } catch (error) {
    console.log(error);
    return c.json(error, 500);
  }
});

educationRoute.get("/:userId", async (c: any) => {
  try {
    const DATABASE_URL: string = c.env.DATABASE_URL;
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL
    }).$extends(withAccelerate());

    const userId = c.req.param('userId');
    console.log(userId);

    if (!userId) {
      throw new Error("UserId is required");
    }

    const allEducation = await prisma.education.findMany({
      where: {
        userId: userId,
      },
    });

    console.log(allEducation);
    return c.json(allEducation, 200);

  } catch (error) {
    console.log(error);
    return c.json(error, 500);
  }
});

educationRoute.delete("/:educationId", async (c: any) => {
  try {
    const DATABASE_URL: string = c.env.DATABASE_URL;
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL
    }).$extends(withAccelerate());

    const educationId = c.req.param('educationId');
    console.log(educationId);

    if (!educationId) {
      throw new Error("EducationId is required");
    }

    const deletedEducation = await prisma.education.delete({
      where: {
        id: educationId,
      },
    });

    console.log(deletedEducation);
    return c.json(deletedEducation, 200);

  } catch (error) {
    console.log(error);
    return c.json(error, 500);
  }
});
