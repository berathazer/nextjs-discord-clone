import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface MemberIdPageProps {
	params: {
		serverId: string;
		memberId: string;
	};
	searchParams: {
		video: boolean;
	};
}

export const dynamic ="force-dynamic";

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const currentMember = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	});

	if (!currentMember) {
		return redirect("/");
	}

	const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

	if (!conversation) {
		return redirect(`/servers/${params.serverId}`);
	}

	const { sender, reciever } = conversation;

	const otherMember = sender.profileId === profile.id ? reciever : sender;

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader name={otherMember.profile.name} serverId={params.serverId} type={"conversation"} imageUrl={otherMember.profile.imageUrl} />

			{searchParams.video && <MediaRoom chatId={conversation.id} video={true} audio={true} />}
			{!searchParams.video && (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						chatId={conversation.id}
						type="conversation"
						apiUrl={"/api/direct-messages"}
						paramKey={"conversationId"}
						paramValue={conversation.id}
						socketUrl={"/api/socket/direct-messages"}
						socketQuery={{
							conversationId: conversation.id,
						}}
					/>

					<ChatInput
						name={otherMember.profile.name}
						type="conversation"
						apiUrl={"/api/socket/direct-messages"}
						query={{
							conversationId: conversation.id,
						}}
					/>
				</>
			)}
		</div>
	);
};

export default MemberIdPage;
