import { db } from "./db";

export const getOrCreateConversation = async (senderId: string, recieverId: string) => {

    let conversation = await findConversation(senderId, recieverId) || await findConversation(recieverId, senderId);

    if (!conversation) {
        conversation = await createConversation(senderId, recieverId);
    }

    return conversation
}

const findConversation = async (senderId: string, recieverId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { senderId: senderId },
                    { recieverId: recieverId }
                ]
            }, include: {
                sender: {
                    include: { profile: true }
                },
                reciever: {
                    include: { profile: true }
                }
            }
        })
    } catch (error) {
        return null
    }
}

const createConversation = async (senderId: string, recieverId: string) => {
    try {
        return await db.conversation.create({
            data: {
                senderId,
                recieverId
            },
            include: {
                sender: {
                    include: { profile: true }
                },
                reciever: {
                    include: { profile: true }
                }
            }
        })
    } catch (error) {
        return null
    }
}