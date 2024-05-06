import type { NotificationType } from "$lib/helpers/types.js"
import { dbClient } from "$lib/server/db.js"
import { commentsTable, notificationsTable, postsTable, usersTable } from "$lib/server/schema.js"
import { redirect } from "@sveltejs/kit"
import { eq, getTableColumns } from "drizzle-orm"

export const load = async(request) =>{
    const session = request.locals.session
    
    if(!session) throw redirect(301, "/login")
    const {password, ...rest} = getTableColumns(usersTable)
    const _notifications = await dbClient.select({
        notification: getTableColumns(notificationsTable),
        user: {...rest}
    }).from(notificationsTable).where(eq(notificationsTable.targetUser, session.userId)).leftJoin(usersTable, eq(usersTable.id, notificationsTable.sourceUser))

    const notifications = fetchNotifications(_notifications)
    return{
        streamed:{
            notifications
        }
    }
}

async function fetchNotifications(notifications: NotificationType[]){

        const data:NotificationType[] = []

        for(const item of notifications){

        const notif: NotificationType = item
        let row: {content: string | undefined, parentId: string | undefined} = {
            content: undefined,
            parentId: undefined
        }

        if(notif.notification.entityType === "comment" || notif.notification.entityType === "reply"){
            row = (await dbClient.select({content: commentsTable.comment, parentId: commentsTable.post}).from(commentsTable).where(eq(commentsTable.id, notif.notification.entityId)))[0]
        }

        else if (notif.notification.entityType === "post_like"){
            row = (await dbClient.select({content: postsTable.content, parentId: postsTable.id}).from(postsTable).where(eq(postsTable.id, notif.notification.entityId)))[0]
        }

        else if (notif.notification.entityType === "comment_like"){
            row = (await dbClient.select({content: commentsTable.comment, parentId: commentsTable.post}).from(commentsTable).where(eq(commentsTable.id, notif.notification.entityId)))[0]
        }

        if(!row) continue
        if(row.content || row.parentId){
            if(row.content) row.content.length > 30 ? row.content = row.content.slice(0, 29) + "..." : ""
            
            notif.notification.content = row.content
            notif.notification.parentId = row.parentId
        }

        data.push(notif)
    }

    // sort the array by unread notifications
    return data.sort((a, b) => {
        if (a.notification.read === b.notification.read) {
            return 0; // If both notifications have the same read status, keep their order
        }
        return a.notification.read ? 1 : -1; // Sort by read status (false comes before true)
    });
}