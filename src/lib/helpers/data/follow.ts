import { dbClient } from "$lib/server/db"
import { usersTable, userFollowsTable } from "$lib/server/schema"
import { json } from "@sveltejs/kit"
import {  and, eq, ne } from "drizzle-orm"

export const getFollowers = async (skip:number = 0, userId: string)=>{
    try{
        const followers = await dbClient.select({
            id:usersTable.id,
            username:usersTable.username,
            profilePic:usersTable.profilePictureUrl,
        }).from(userFollowsTable).leftJoin(usersTable, eq(usersTable.id, userFollowsTable.follower)).where(
            and(
                eq(userFollowsTable.following, userId),
                ne(userFollowsTable.status, "pending")
        )).limit(7).offset(skip)
        return json({success: true, data: followers})
    }
    catch(e){
        return json({error: true,})
    }

}

export const getFollowing = async (skip:number = 0, userId: string)=>{
    try{
        const followers = await dbClient.select({
            id:usersTable.id,
            username:usersTable.username,
            profilePic:usersTable.profilePictureUrl,
        }).from(userFollowsTable).leftJoin(usersTable, eq(usersTable.id, userFollowsTable.following)).where(
            and(
                eq(userFollowsTable.follower, userId),
                ne(userFollowsTable.status, "pending")
            )).limit(7).offset(skip)
        return json({success: true, data: followers})
    }
    catch(e){
        return json({error: true,})
    }

}


export const followEachOther = async (userId1: string, userId2: string)=>{
    const followSubquery = dbClient.select().from(userFollowsTable).where(eq(userFollowsTable.follower, userId1)).as("followSubquery")
    try{
        const mutuals = await dbClient.select().from(userFollowsTable).where(eq(userFollowsTable.following, userId2)).leftJoin(followSubquery, eq(userFollowsTable.follower, userId2))
        return json({success: true, data: mutuals.length > 0})
    }
    catch(e){
        return json({error: true})
    }

}
