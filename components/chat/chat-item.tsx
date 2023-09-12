"use client";
import z from "zod";
import axios from "axios";
import qs from "query-string";

import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface ChatItemProps {
	id: string;
	content: string;
	member: Member & {
		profile: Profile;
	};
	timestamp: string;
	fileUrl: string | null;
	deleted: boolean;
	currentMember: Member;
	isUpdated: boolean;
	socketUrl: string;
	socketQuery: Record<string, string>;
}

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className="ml-auto w-4 h-4 text-indigo-500" />,
	[MemberRole.ADMIN]: <ShieldAlert className="ml-auto w-4 h-4 text-rose-500" />,
};

const formSchema = z.object({
	content: z.string().min(1),
});

const ChatItem = ({ content, currentMember, deleted, fileUrl, id, isUpdated, member, socketQuery, socketUrl, timestamp }: ChatItemProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const router = useRouter();
	const params = useParams();

	const { onOpen } = useModal();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: content,
		},
	});

	const isLoading = form.formState.isSubmitting;

	useEffect(() => {
		form.reset({
			content: content,
		});
	}, [content]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" || e.keyCode === 27) {
				setIsEditing(false);
				form.reset();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const fileType = fileUrl?.split(".").pop();

	const isAdmin = currentMember.role === MemberRole.ADMIN;
	const isModerator = currentMember.role === MemberRole.MODERATOR;
	const isOwner = currentMember.id === member.id;

	const canDeleteMessage = (isOwner || isModerator || isAdmin) && !deleted;

	const canEditMessage = isOwner && !deleted && !fileUrl;

	const isPdf = fileType === "pdf" && fileUrl;
	const isImage = !isPdf && fileUrl;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query: socketQuery,
			});

			await axios.patch(url, values);
			form.reset();
			setIsEditing(false);
		} catch (error) {
			console.log("chatItemError:", error);
		}
	};

	const onMemberClick = () => {
		if (member.id === currentMember.id) {
			return;
		}

		router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
	};
	return (
		<div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
			<div className="group flex gap-x-2 items-start w-full">
				<div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
					<UserAvatar src={member.profile.imageUrl} />
				</div>
				<div className="flex flex-col w-full text-sm gap-y-1">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center gap-x-2">
							<p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
								{member.profile.name}
							</p>
							<ActionTooltip label={member.role}>{roleIconMap[member.role]}</ActionTooltip>
						</div>
						<span className=" text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
					</div>
					{isImage && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
						>
							<Image alt={fileUrl} src={fileUrl} fill className="object-cover" />
						</a>
					)}
					{isPdf && (
						<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
							<FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
							<a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
								{"PDF File"}
							</a>
						</div>
					)}

					{!fileUrl && !isEditing && (
						<p className={cn("text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
							{content}
							{isUpdated && !deleted && <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">Edited</span>}
						</p>
					)}
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-x-2 pt-2">
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<div className="relative w-full">
													<Input
														disabled={isLoading}
														className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-300"
														placeholder="Edited message"
														{...field}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button disabled={isLoading} size={"sm"} variant={"secondary"}>
									Save
								</Button>
							</form>
							<span className="text-[10px] mt-1 text-zinc-400">
								Press escape to <span className="text-indigo-500 dark:text-indigo-400">cancel</span> • enter to{" "}
								<span className="text-indigo-500 dark:text-indigo-400">save</span>
							</span>
						</Form>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
					{canEditMessage && (
						<ActionTooltip label="Edit">
							<Edit
								onClick={() => setIsEditing(true)}
								className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
							/>
						</ActionTooltip>
					)}
					{canDeleteMessage && (
						<ActionTooltip label="Delete">
							<Trash
								onClick={() =>
									onOpen("deleteMessage", {
										apiUrl: `${socketUrl}/${id}`,
										query: socketQuery,
									})
								}
								className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
							/>
						</ActionTooltip>
					)}
				</div>
			)}
		</div>
	);
};

export default ChatItem;
