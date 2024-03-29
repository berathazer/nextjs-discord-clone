import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//export const dynamic ="force-dynamic";

const ServerIdPage = async ({ params }: { params: { serverId: string } }) => {
	const profile = await currentProfile();
	if (!profile) {
		return redirectToSignIn();
	}

	const { serverId } = params;
	const server = await db.server.findUnique({
		where: {
			id: serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: "general",
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	const initialChannel = server?.channels[0];
	if (initialChannel?.name !== "general") {
		return null;
	}

	return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
};

export default ServerIdPage;
