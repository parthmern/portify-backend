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

export const workRoute = new Hono();


workRoute.post("/", async(c:any)=>{

    try{

        const DATABASE_URL : string = c.env.DATABASE_URL;
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
        console.log("useri=>", userId);

        if (file) {
            
            var uploadResponse: any = await uploadToCloudinary(file);
            console.log(uploadResponse.secure_url);
            // return c.json({ error: 'No file uploaded' }, 400);
        }

        if( !fields || !userId ){
            throw Error("Form data or userid is needed");
        }

        //         company     String?
        // href        String?
        // location    String?
        // title       String
        // logoUrl     String?
        // start       String?
        // end         String?
        // description String

        const createdWork = await prisma.works.create({
            data : {
                userId : userId,
                company : fields?.company,
                href : fields?.href,
                location: fields?.location,
                title: fields?.title,
                logoUrl: file && uploadResponse.secure_url ? uploadResponse.secure_url : null,
                start : fields?.start,
                end: fields?.end,
                description: fields?.description,
            }
        })

        console.log("createdWork==>",createdWork);


        return c.json(createdWork, 200);
        
    }
    catch(error){
        console.log(error);
        return c.json(error, 500);
    }


})

workRoute.get("/:userId", async (c:any)=>{

    try{
        const DATABASE_URL : string = c.env.DATABASE_URL;
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate());

        const userId = c.req.param('userId');
        console.log(userId);

        if(!userId){
            throw Error("Userid is needed");
        }

        const allWorks = await prisma.works.findMany({
            where:{
                userId : userId,
            }
        })

        console.log(allWorks);

        return c.json(allWorks, 200);

        

    }
    catch(error){
        console.log(error);
        return c.json(error, 500);
    }

})

workRoute.delete("/:workid", async(c:any)=>{


    try{
        const DATABASE_URL : string = c.env.DATABASE_URL;
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate());

        const workid = c.req.param('workid');
        console.log(workid);

        if(!workid){
            throw Error("workid is needed");
        }

        const deletedwork = await prisma.works.delete({
            where:{
                id : workid,
            }
        })

        console.log(deletedwork);

        return c.json(deletedwork, 200);

    }
    catch(error){
        console.log(error);
        return c.json(error, 500);
    }


})