import type { NotificationType } from "$lib/helpers/types.js"
import { dbClient } from "$lib/server/db.js"
import { commentsTable, notificationsTable, postsTable, usersTable } from "$lib/server/schema.js"
import { redirect } from "@sveltejs/kit"
import { eq, getTableColumns, and, or } from "drizzle-orm"


export const load = async(request) =>{
    const session = request.locals.session
    
    if(!session) throw redirect(301, "/login")

    const notifications = fetchNotifications(session.userId)
    return{
        streamed:{
            notifications
        }
    }
}

async function fetchNotifications(userId:string){

  const {password, ...rest} = getTableColumns(usersTable)
  return await dbClient.select({
          notification: getTableColumns(notificationsTable),
          user: {...rest}
      }).from(notificationsTable)
      .where(and(eq(notificationsTable.targetUser, userId), eq(notificationsTable.entityType, "follow")))
      .leftJoin(usersTable, eq(usersTable.id, notificationsTable.sourceUser))
}