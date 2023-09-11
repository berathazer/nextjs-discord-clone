import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
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
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
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
	
		</div>
	);
};

export default MemberIdPage;
