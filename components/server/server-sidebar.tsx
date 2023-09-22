import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, Shield, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

type ServerSidebarProps = {
	serverId: string;
};

const iconMap = {
	[ChannelType.TEXT]: <Hash className="mr-2 w-4 h-4" />,
	[ChannelType.AUDIO]: <Mic className="mr-2 w-4 h-4" />,
	[ChannelType.VIDEO]: <Video className="mr-2 w-4 h-4" />,
};

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className="mr-2 w-4 h-4 text-indigo-500" />,
	[MemberRole.ADMIN]: <ShieldAlert className="mr-2 w-4 h-4 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	const profile = await currentProfile();

	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc",
				},
			},
		},
	});

	if (!server) {
		return redirect("/");
	}

	//tüm kanalları getirdik
	const textChannels = server?.channels.filter((ch) => ch.type === ChannelType.TEXT);
	const audioChannels = server?.channels.filter((ch) => ch.type === ChannelType.AUDIO);
	const videoChannels = server?.channels.filter((ch) => ch.type === ChannelType.VIDEO);

	//kendimiz hariç tüm kullanıcıları getirdik
	const members = server?.members.filter((member) => member.profileId !== profile?.id);

	//kendi rolümüz
	const role = server?.members.find((member) => member.profileId === profile?.id)?.role;

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={role} />
			<ScrollArea className="flex-1 px-3 z-0">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: "Text Channels",
								type: "channel",
								data: textChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: "Voice Channels",
								type: "channel",
								data: audioChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: "Video Channels",
								type: "channel",
								data: videoChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: "Members",
								type: "member",
								data: server.members.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap[member.role],
								})),
							},
						]}
					/>
				</div>
				<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md  my-2" />
				{!!textChannels?.length && (
					<div className="mb-2">
						<ServerSection label="Text channels" server={server} sectionType="channels" channelType={ChannelType.TEXT} role={role} />
						<div className="space-y-[2px]">
							{textChannels.map((channel) => (
								<ServerChannel key={channel.id} channel={channel} role={role} server={server} />
							))}
						</div>
					</div>
				)}

				{!!audioChannels?.length && (
					<div className="mb-2">
						<ServerSection label="Audio channels" server={server} sectionType="channels" channelType={ChannelType.AUDIO} role={role} />
						<div className="space-y-[2px]">
							{audioChannels.map((channel) => (
								<ServerChannel key={channel.id} channel={channel} role={role} server={server} />
							))}
						</div>
					</div>
				)}

				{!!videoChannels?.length && (
					<div className="mb-2">
						<ServerSection label="Video channels" server={server} sectionType="channels" channelType={ChannelType.VIDEO} role={role} />
						<div className="space-y-[2px]">
							{videoChannels.map((channel) => (
								<ServerChannel key={channel.id} channel={channel} role={role} server={server} />
							))}
						</div>
					</div>
				)}

				{!!members?.length && (
					<div className="mb-2">
						<ServerSection label="Members" server={server} sectionType="members" channelType={ChannelType.VIDEO} role={role} />
						<div className="space-y-[2px]">
							{members.map((member) => (
								<ServerMember key={member.id} member={member} server={server} />
							))}
						</div>
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default ServerSidebar;
