import { dbClient } from "$lib/server/db";
import { notificationsTable } from "$lib/server/schema";
import { v4 as uuidv4 } from "uuid";

export const insertNotification = async(source: string, target:string, id: string, type: string) =>{

    await dbClient.insert(notificationsTable).values({
        id: uuidv4(),
        sourceUser: source,
        targetUser: target,
        entityId: id,
        entityType: type,
    });
    
}