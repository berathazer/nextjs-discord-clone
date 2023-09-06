import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

type Profile = {
	id: string;
	userId: string;
	name: string;
	imageUrl: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
};

const SetupPage = async () => {
	const profile: Profile = await initialProfile();
	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	if (server) {
		return redirect(`/servers/${server.id}`);
	}

	return <div className="p-4">Create a Server</div>;
};

export default SetupPage;
