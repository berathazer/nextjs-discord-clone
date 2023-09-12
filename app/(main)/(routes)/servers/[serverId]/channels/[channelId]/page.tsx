import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const channel = await db.channel.findUnique({
		where: {
			id: params.channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	});

	if (!channel || !member) {
		return redirect("/");
	}
	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader name={channel.name} serverId={params.serverId} type={"channel"} imageUrl={member.profile.imageUrl} />

			{channel.type === "TEXT" && (
				<>
					<ChatMessages
						member={member}
						name={channel.name}
						type={"channel"}
						apiUrl={"/api/messages"}
						socketUrl={"/api/socket/messages"}
						socketQuery={{
							channelId: channel.id,
							serverId: channel.serverId,
						}}
						paramKey="channelId"
						paramValue={channel.id}
						chatId={channel.id}
					/>

					<ChatInput
						name={channel.name}
						type={"channel"}
						apiUrl={"/api/socket/messages"}
						query={{
							channelId: channel.id,
							serverId: channel.serverId,
						}}
					/>
				</>
			)}

			{channel.type === "AUDIO" && <MediaRoom audio={true} video={false} chatId={channel.id} />}
			{channel.type === "VIDEO" && <MediaRoom audio={false} video={true} chatId={channel.id} />}
		</div>
	);
};

export default ChannelIdPage;
