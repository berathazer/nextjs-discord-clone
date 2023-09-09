
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.serverId) {
            return new NextResponse("Server ID is required", { status: 400 })
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId, profileId: profile.id,
            },

        })


        return NextResponse.json(server);
    } catch (error) {
        console.log("SERVER_ID_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}